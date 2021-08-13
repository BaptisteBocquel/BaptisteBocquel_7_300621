//Imports
const express = require('express');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const likeRoutes = require('./routes/like');
const commentsRoutes = require('./routes/comments');
const app = express();
const path = require('path');
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');
const filter = require('content-filter');
const helmet = require('helmet');

// HEADERS TO AVOID CORS RESTRICTIONS

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,x-www-form-urlencoded, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();   
});

// SET EXPRESS-RATE-LIMIT (15 ATTEMPTS ALL 15 MINUTES)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000
  });
  
app.use(limiter);

//BodyParser configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// SETTINGS CONTENT-FILTER

const blackList = ['$','{','&&','||'];
const options = {
	urlBlackList: blackList,
	bodyBlackList: blackList
};

app.use(filter(options));

// CALL HELMET

app.use(helmet());


app.use('/images', express.static(path.join(__dirname, 'images')));

//Configure routes
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes)
app.use('/api/messages', likeRoutes)
app.use('/api/messages', commentsRoutes)


// EXPORT EXPRESS
module.exports = app;