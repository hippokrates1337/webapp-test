import express from 'express';
import cors from 'cors';
import { connectDB } from './database/connection.js';
import publicDataRoutes from './routes/publicData.js';

// Configure Express app to use CORS (all origins allowed) and JSON
console.log('Index.js - Setting up Express app...');

const app = express();
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Connect database
console.log('Index.js - Connecting to the database...');
await connectDB();

// Configure routes
console.log('Index.js - Setting up routes...');
app.use('/publicData', publicDataRoutes);

app.get('/', async (req, res) => {
  res.status(200);
});

// Start the app
console.log('Index.js - Starting the app...');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Index.js - App is listening on port ' + port);
});
