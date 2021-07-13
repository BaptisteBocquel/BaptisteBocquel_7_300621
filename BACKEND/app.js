//Imports
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const likeRoutes = require('./routes/like');
const commentsRoutes = require('./routes/comments');
const app = express();
const path = require('path');
// HEADERS TO AVOID CORS RESTRICTIONS

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,x-www-form-urlencoded, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();   
});

//BodyParser configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

//Configure routes
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes)
app.use('/api/messages', likeRoutes)
app.use('/api/messages', commentsRoutes)


// EXPORT EXPRESS
module.exports = app;