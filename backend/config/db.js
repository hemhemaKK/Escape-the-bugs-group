import mongoose from 'mongoose';


export const connectDB = async () => {
const uri = process.env.MONGO_URI;
await mongoose.connect(uri, { dbName: 'escape_the_bug' });
console.log('✅ MongoDB connected');
};