const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const express = require('express');
const app = express();
const Joi = require('joi');
const logger = require('./logger');
const auth = require('./authentication');
const helmet = require("helmet");
const morgan = require('morgan')

app.set('view engine', 'pug');

// console.log(`Node env: ${process.env.NODE_ENV}`)

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

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

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req,res) => {
    res.render('index', {
        title: "my express app",
        message: "Welcome to my Express demo"
    });
});

app.get('/api/courses', (req,res)=>{
    res.send (courses);
});

app.get('/api/courses/:id', (req, res)=>{
    
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with the given id doesnot found');
    res.send(course);
});

app.post('/api/courses', (req, res) =>{
    const result = validateCourse(req.body);
    if (result.error){
        //400 bad request
        return res.status(400).send(result.error.details[0].message);
        
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res)=>{
    //look up the course
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with the given id doesnot found');
    
    //validate the request
    const result = validateCourse(req.body);
    if (result.error){
        //400 bad request
        return res.status(400).send(result.error.details[0].message);  
    }

    //update the course
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req,res)=>{
    //look up the course
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with the given id doesnot found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

//validate the request function
function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
};

const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`listening on port ${port}..`)});