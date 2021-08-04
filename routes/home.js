const express = require('express');
const router = express.Router();

app.get('/', (req,res) => {
    res.render('index', {
        title: "my express app",
        message: "Welcome to my Express demo"
    });
});

module.exports = router;