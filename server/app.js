import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import routes from './routes';

dotenv.config();

// Set up the express app
const app = express();

// Enable CORS
app.use(cors());

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());

// Initializing Passport
app.use(passport.initialize());

// Creating user session
app.use(expressSession(
  { secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }
));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('/', (req, res) => res.status(200).send({
  message: 'Authors Haven.',
}));

// Routes
app.use('/api', routes);

// Set Port
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server running on port', port));

export default app;
