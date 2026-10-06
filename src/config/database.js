const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('MongoDB เชื่อมต่อสำเร็จ');
    } catch (error) {
        console.error('การเชื่อมต่อกับ MongoDB ไม่สำเร็จ:', error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;