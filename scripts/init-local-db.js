const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const root = path.resolve(__dirname, "..");
const localDir = path.join(root, ".local");
const dataDir = path.join(localDir, "mongodb", "data");
const replicaSet = "shopflow-rs";
const uri = "mongodb://127.0.0.1:27018/shopflow_local?replicaSet=shopflow-rs&directConnection=true";
const { MongoClient } = mongoose.mongo;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function initializeReplicaSet() {
  let client;
  for (let attempt = 0; attempt < 40; attempt++) {
    client = new MongoClient("mongodb://127.0.0.1:27018/?directConnection=true", {
      serverSelectionTimeoutMS: 750,
    });
    try { await client.connect(); break; }
    catch (error) {
      await client.close();
      if (attempt === 39) throw new Error("MongoDB did not start. See .local/mongodb/mongod.log");
      await pause(250);
    }
  }
  try {
    const admin = client.db("admin");
    const options = await admin.command({ getCmdLineOpts: 1 });
    const runningPath = path.resolve(options.parsed.storage.dbPath).toLowerCase();
    if (runningPath !== dataDir.toLowerCase() ||
        (options.parsed.replication?.replSetName ?? options.parsed.replication?.replSet) !== replicaSet) {
      throw new Error("Port 27018 belongs to a different MongoDB instance; setup stopped without changing it.");
    }
    try {
      const result = await admin.command({ replSetGetConfig: 1 });
      if (result.config._id !== replicaSet) throw new Error("Unexpected replica set name.");
    } catch (error) {
      if (error.code !== 94) throw error;
      await admin.command({
        replSetInitiate: { _id: replicaSet, members: [{ _id: 0, host: "localhost:27018" }] },
      });
      console.log("Initialized local replica set.");
    }
    for (let attempt = 0; attempt < 40; attempt++) {
      const hello = await admin.command({ hello: 1 });
      if (hello.isWritablePrimary && hello.setName === replicaSet) return;
      await pause(500);
    }
    throw new Error("Replica set has not elected a primary yet. Run db:start again.");
  } finally {
    await client.close();
  }
}

function configureEnvironment() {
  const envPath = path.join(root, ".env");
  const original = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const existing = dotenv.parse(original);
  const values = {
    MONGODB_URI: uri,
    JWT_SECRET: existing.JWT_SECRET || crypto.randomBytes(48).toString("hex"),
    PORT: existing.PORT || "3000",
    CLIENT_URL: existing.CLIENT_URL || "http://localhost:5173",
  };
  let text = original;
  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp("^" + key + "=.*$", "m");
    const line = key + "=" + value;
    text = pattern.test(text) ? text.replace(pattern, () => line) : text.replace(/\s*$/, "") + "\n" + line + "\n";
  }
  fs.writeFileSync(envPath, text.trimStart(), { mode: 0o600 });
}

async function main() {
  fs.mkdirSync(localDir, { recursive: true });
  await initializeReplicaSet();
  configureEnvironment();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  const User = require("../src/models/user.model");
  const Product = require("../src/models/product.model");
  const Cart = require("../src/models/cart.model");
  const Order = require("../src/models/order.model");
  await Promise.all([User.init(), Product.init(), Cart.init(), Order.init()]);

  const username = "shopflow-admin";
  const existing = await User.findOne({ username });
  if (!existing) {
    const password = crypto.randomBytes(18).toString("base64url");
    const passwordHash = await bcrypt.hash(password, 12);
    const credentialsPath = path.join(localDir, "access.txt");
    // Save before creating the account so a filesystem failure cannot lose its password.
    fs.writeFileSync(credentialsPath,
      "ShopFlow LOCAL development account\nUsername: " + username +
      "\nPassword: " + password + "\nFrontend: http://localhost:5173\n" +
      "MongoDB: " + uri + "\n",
      { mode: 0o600 });
    await User.create({ username, password: passwordHash, role: "admin", status: "approved" });
    console.log("Created approved administrator. Credentials: .local/access.txt");
  } else {
    if (existing.role !== "admin" || existing.status !== "approved") {
      throw new Error("shopflow-admin already exists with different permissions; it was not modified.");
    }
    console.log("Existing administrator preserved.");
  }

  console.log("Database ready: shopflow_local at 127.0.0.1:27018");
  console.log("Collections: users, products, carts, orders");
  console.log("Backend .env configured. Product and order data are not seeded.");
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());

