# Local MongoDB for ShopFlow

This project uses its own MongoDB instance at `127.0.0.1:27018`, database
`shopflow_local`, replica set `shopflow-rs`. The existing Windows MongoDB service
on port 27017 is separate.

## Start after restarting Windows

From this backend folder:

```powershell
npm run db:start
npm start
```

`db:start` starts MongoDB hidden in the background, initializes the replica set
once, creates the model collections/indexes, and configures `.env`.
Running it again preserves the existing data, administrator password and JWT secret.
The database is bound only to 127.0.0.1.

In the frontend folder, use `npm run dev` and open
[ShopFlow](http://localhost:5173).

## Connection

```text
mongodb://127.0.0.1:27018/shopflow_local?replicaSet=shopflow-rs&directConnection=true
```

Paste the same URI into MongoDB Compass. No MongoDB database username/password is
configured for this loopback-only development instance. The ShopFlow login account
is separate: username `shopflow-admin`, with its generated password in
`.local/access.txt`.

## Local files

- `.env`: backend connection, generated JWT secret, API port and frontend origin.
- `.local/access.txt`: local administrator credentials.
- `.local/mongodb/data/`: persistent database files.
- `.local/mongodb/mongod.log`: MongoDB server log.
- `.local/api.log`, `.local/api-error.log`: logs when started by the setup session.

These local files are ignored by Git. Preserve the data directory to keep your data.
No old database records are recovered or imported. Products, carts and orders start empty.
Add products through the admin screen.

The order controllers use MongoDB transactions, so this instance uses a single-member
replica set. See [MongoDB's replica-set setup documentation](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/).
This setup is for development on this computer; it is not a replicated production cluster.

