import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('/', (req, res) => res.status(200).send({
  message: 'Authors Haven.',
}));

// Set Port
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server running in port', port));

export default app;
