const express = require('express')
const app = express()

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
    // res.send("hi")
    // res.send(req.params.id);
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('the course with the given id doesnot found');
    res.send(course);
    // res.send(course.name);
});
const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`listening on port ${port}..`)});