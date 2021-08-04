const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req,res) => {
    res.send('Hello world');
});

app.get('/api/courses', (req,res)=>{
    res.send (courses);
});

app.get('/api/courses/:id', (req, res)=>{
    
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('the course with the given id doesnot found');
    res.send(course);
});

app.post('/api/courses', (req, res) =>{
    const result = validateCourse(req.body);
    if (result.error){
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
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
    if(!course) res.status(404).send('the course with the given id doesnot found');
    
    //validate the request
    const result = validateCourse(req.body);
    if (result.error){
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    //update the course
    course.name = req.body.name;
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