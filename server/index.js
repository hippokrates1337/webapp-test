import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { connectDB } from './database/connection.js';
import publicDataRoutes from './routes/publicData.js';
import privateDataRoutes from './routes/privateData.js';
import accountRoutes from './routes/account.js';
import adminRoutes from './routes/admin.js';


console.log('Index.js - Setting up Express app...');

// Configure Express app to use CORS (all origins allowed) and JSON
const app = express();
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));
app.use(session({
  secret: process.env.TOKEN_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

// Connect database
console.log('Index.js - Connecting to the database...');
await connectDB();

// Set up Pug
app.set("views", path.join(path.dirname(fileURLToPath(import.meta.url)), "views"));
app.set("view engine", "pug");

// Configure routes
console.log('Index.js - Setting up routes...');
app.use('/publicData', publicDataRoutes);
app.use('/privateData', privateDataRoutes);
app.use('/account', accountRoutes);
app.use('/admin', adminRoutes);

app.get('/', async (req, res) => {
  res.status(200).send('This is the resource consumption app backend - nothing to see here...');
});

// Start the app
console.log('Index.js - Starting the app...');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Index.js - App is listening on port ' + port);
});
