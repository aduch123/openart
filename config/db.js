const mongoose = require('mongoose');

// Cache for serverless (Vercel)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // If already connected, return the connection
    if (cached.conn) {
        return cached.conn;
    }

    // If connection is pending, wait for it
    if (cached.promise) {
        return cached.promise;
    }

    // Create new connection
    const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
        .then((mongoose) => {
            console.log('✅ MongoDB Connected');
            return mongoose;
        })
        .catch((err) => {
            console.error('❌ MongoDB Error:', err.message);
            cached.promise = null;
            throw err;
        });

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectDB;