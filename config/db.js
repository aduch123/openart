const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: true,
            serverSelectionTimeoutMS: 30000,
        });
        isConnected = true;
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
        throw error;
    }
}

module.exports = connectDB;