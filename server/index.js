import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.set('strictQuery', false);

try {
    await mongoose.connect(process.env.MONGODB_URI);
} catch(err) {
    console.error(err);
}

app.get('/', async (req, res) => {
  const allUsers = await User.find();
  res.status(200).json(allUsers);
});

app.listen(port, () => {
  console.log('App is listening on port ${PORT}');
});
