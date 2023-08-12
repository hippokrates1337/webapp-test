import express from 'express';
import cors from 'cors';
import { connectDB } from './database/connection.js';

// Configure Express app to use CORS (all origins allowed) and JSON
const app = express();
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Connect database
await connectDB();

// Configure routes
app.get('/', async (req, res) => {
  res.status(200);
});

// Start the app
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App is listening on port ' + port);
});
