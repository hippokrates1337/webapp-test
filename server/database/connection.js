import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Setup dotenv to load database connection URL
dotenv.config();

// Connect the database
const connectDB = async () => {
    mongoose.set('strictQuery', false);

    try {
        return await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'ResourceConsumption'
        });
    } catch(err) {
        console.error(err);
    }
};


export {connectDB};