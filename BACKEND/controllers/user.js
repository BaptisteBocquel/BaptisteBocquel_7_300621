const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const models = require('../models'); 

const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;


exports.signup = (req,res,next) => {
    //Params
    const {user_mail, user_pseudo,user_password, user_bio} = req.body;

    if (user_mail == null || user_pseudo == null || user_password == null ){
        return res.status(400).json({ 'error' : 'missing parameters' });
    }

    // verify pseudo length, mail regex, password ...
    if (user_pseudo.length >= 13 || user_pseudo.length <= 4){
        return res.status(400).json({ 'error' : 'username must be length 5 - 12 characters' });
    }

    // if email regex return false => error 400
    if(!email_regex.test(user_mail)){
        return res.status(420).json({'error' : 'invalid email'});
    }

    // if password regex return false => error 400 (password with at least: one digit, one lower case, one upper case, at least 8 characters)
    if(!password_regex.test(user_password)){
        return res.status(422).json({'error' : 'invalid password'});
    }

    models.User.findOne({
        attributes: ['user_mail'],
        where: {user_mail: user_mail}
    })
    .then(userFound => {
        if(!userFound){
            bcrypt.hash(user_password,5)
            .then(hash => {
                models.User.create({
                    user_mail: user_mail,
                    user_pseudo: user_pseudo,
                    user_password: hash,
                    user_bio: user_bio,
                    user_admin: 0
            })
            .then( newUser => {
                return res.status(201).json({
                    'userId': newUser.id
                })
            })
            .catch( error => {
                return res.status(500).json({'error' : 'cannot add user'});
            })
        })
        }else{
            return res.status(409).json({ 'error' : 'user already exist'});
        }
    })
    .catch(() => res.status(500).json({ 'error' : 'unable to verify user' }));
};



exports.login = (req,res,next) => {
    //Params
    const { user_mail, user_password} = req.body;

    if(user_mail == null && user_password == null){
        return res.statis(400).json({'error' : 'missing parameters'});
    }

    models.User.findOne({
        where: {user_mail: user_mail}
    })
    .then(userFound =>{
        if(userFound){
            bcrypt.compare(user_password,userFound.user_password)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({"error" : "Invalid password"});
                }else{
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': auth.generatedTokenForUser(userFound),
                        'pseudo': userFound.user_pseudo
                    });
                }
            })
        }else{
            return res.status(404).json({'error': 'User not exist in database'});
        }
    })
    .catch(() => res.status(500).json({ 'error' : 'unable to verify user'}));
};

exports.getUser = (req,res,next) => {
    //getting auth header
    let headerAuth = req.headers['authorization'];
    let userId = auth.getUserId(headerAuth);

    if (userId < 0){
        return res.status(400).json({'error' : 'wrong token'});
    }

    models.User.findOne({
        attributes: ['id', 'user_mail', 'user_pseudo', 'user_bio'],
        where: {id : userId}
    })
    .then( user => {
        if(user){
            res.status(201).json(user);
        } else {
            res.status(404).json({'error': 'user not found'});
        }
    })
    .catch(() => res.status(500).json({'error' : ' cannot fetch user'}));
};

exports.updateUser = (req,res,next) => {
    //getting auth header
    let headerAuth = req.headers['authorization'];
    let userId = auth.getUserId(headerAuth);

    //Params
    let user_bio = req.body.user_bio;

    models.User.findOne({
        attributes: ['id', 'user_bio'],
        where: { id: userId }
    })
    .then( userFound => {
        if(userFound){
            userFound.update({
                user_bio: (user_bio ? user_bio : userFound.user_bio)
            })
            return res.status(201).json(userFound);
        }else{
            return res.status(500).json({'error' : 'cannot update user'});
        }
    })
    .catch(() => res.status(404).json({'error' : 'user not found'}));
};

exports.deleteUser = (req,res,next) => {
    //getting auth header
    let headerAuth = req.headers['authorization'];
    let userId = auth.getUserId(headerAuth);

    models.User.destroy({
        where: { id: userId }
    })
    .then( deletedRecord => {
        if(deletedRecord === 1){
            return res.status(200).json({message: 'Deleted successfully'});
        }else{
            return res.status(404).json({'error' : 'record not found'});
        }
    })
    .catch(() => res.status(404).json({'error' : 'user not found'}));
};