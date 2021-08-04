const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const express = require('express');
const app = express();
const Joi = require('joi');
const logger = require('./middleware/logger');
const auth = require('./middleware/authentication');
const helmet = require("helmet");
const morgan = require('morgan')
const courses = require('../routes/courses');
const home = require('../routes/home');
// console.log(`Node env: ${process.env.NODE_ENV}`)

app.set('view engine', 'pug');
//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

//configuration
console.log('application name: ' + config.get('name'));
console.log('mail password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('morgan enabled ..');
}

//custom middleware
app.use(logger);
app.use(auth);

const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`listening on port ${port}..`)});