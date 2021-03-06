import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import swaggerUI from 'swagger-ui-express';
import apiDocs from '../api_docs.json';
import routes from './routes';
import Trimmer from './middlewares/Trimmer';

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

// Trimming data
app.use(Trimmer.trimBody);

// Creating user session
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Serve documentation for API
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(apiDocs));

// Setup an index route
app.get('/', (req, res) => res.status(200).send({
  message: 'Authors Haven.'
}));

// Routes
app.use('/api', routes);

// Return 404 for nonexistent routes
app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

// Set Port
const port = process.env.PORT;

app.listen(port);

export default app;
