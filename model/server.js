const express = require('express')
const app = express()
require('dotenv').config();
var bodyParser = require('body-parser');
var morgan = require('morgan')
var cors = require('cors');

const mongoose = require('mongoose')
mongoose
    .connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
    .then(() => {
        console.log('Connected to Mongo!');
    })
    .catch((err) => {
        console.error('Error connecting to Mongo', err);
    });
// Add the bodyParser middelware to the express application
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 5000 

//middleware
app.use(cors())
app.use(express.json()); 
app.use(morgan('dev'));

const taskRoute = require('./routes/task')

app.use('/api', taskRoute)

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});
