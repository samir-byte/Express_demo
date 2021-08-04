const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

const express = require('express');
const router = express.Router();

app.get('/', (req,res)=>{
    res.send (courses);
});

app.get('/:id', (req, res)=>{
    
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with the given id doesnot found');
    res.send(course);
});

app.post('/', (req, res) =>{
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

app.put('/:id', (req, res)=>{
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

app.delete('/:id', (req,res)=>{
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

module.exports = router;