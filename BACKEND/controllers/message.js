const models = require('../models');
const auth = require('../middleware/auth');
const fs = require('fs');

exports.createMessage = (req,res,next) => {
    //getting auth header
    let headerAuth = req.headers['authorization'];
    
    let userId = auth.getUserId(headerAuth);
    
    //Params
    let message_title = req.body.message_title;
    let message_content = req.body.message_content;
    if(req.file === undefined){
        var link = req.body.message_attachment;
        var message_attachment = link.replace('watch?v=', 'embed/').split('&')[0];
        
    }else{
        var message_attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    if(message_title === "" || message_content === ""){
        return res.status(400).json({ 'error' : 'missing parameters'});
    }

    models.User.findOne({
        where: { id: userId }
    })
    .then(userFound => {
        if(userFound){
            models.Message.create({
                message_title : message_title,
                message_content: message_content,
                message_attachment: message_attachment,
                message_likes : 0,
                UserId : userFound.id,
            })
            .then(newMessage => {
                return res.status(201).json(newMessage);
            })
            .catch(() => res.status(500).json({'error' : 'cannot post message'}))    
        }else{
            return res.status(404).json({ 'error' : 'user not found'});
        } 
    })
    .catch((e) => res.status(500).json({'error' : 'unable to verify user'}))
};



exports.getMessages = (req,res,next) => {
    /*if(!req.session.user){
        return res.status(401).send()
    }else{*/
        
        models.Message.findAll({
        
            order: [
                ['id', 'DESC'],
                
            ],
            include : [
                {
                model : models.User,
                attributes: ['user_pseudo'],
                },
            ]
        })
        .then(messages => {
                  
            if(messages){
                res.status(200).json(messages);
            } else {
                res.status(404).json({'error' : 'no messages found'});
            }
        })
        .catch ((error) => { 
            console.log(error);
            res.status(500).json({"error" : "invalid fields"});
        });
    //}
    
};

exports.deleteMessage = (req,res,next) => {
    let headerAuth = req.headers['authorization'];
    let userId = auth.getUserId(headerAuth);

    let messageId = parseInt(req.params.messageId);

    if (messageId <= 0){
        return res.status(401).json({ 'error': 'invalid parameters'}); //if idMessage valid or not
    }

    models.Like.destroy({
        where : {messageId : messageId}
    })
    .then(deletedRecord => {
        if (deletedRecord >= 0){
            models.Comment.destroy({
                where : {messageId : messageId}
            })
            .then(deletedRecord => {
                if (deletedRecord >= 0){
                    models.User.findOne({
                        where : { id: userId }
                    })
                    .then(userFound => {
                        if(userFound){
                            
                            models.Message.findOne({
                                where: { id: messageId}
                            })
                            .then(messageFound => {
                                const filename = messageFound.message_attachment.split('/images/')[1];
                                fs.unlink(`images/${filename}`, () => {
                                    models.Message.destroy({
                                        where: { id: messageId }
                                    })
                                    .then( deletedRecord => {
                                        if(deletedRecord === 1){
                                            return res.status(200).json({message: 'Deleted successfully'});
                                        }else{
                                            return res.status(404).json({'error' : 'Impossible to delete'});
                                        }
                                    })        
                                })
                                   
                            })
                            .catch(() => res.status(500).json({'error': 'unable to find user'}));
                        } else{
                            return res.status(404).json({'error' : 'user dont exist'});
                        }  
                    })
                    .catch(() => res.status(500).json({'error' : 'unable to verify Message'}));
                }
                
            })
            .catch(() => res.status(500).json({'error' : 'unable to delete Comments'})) 
        }
    })
    .catch(() => res.status(500).json({'error' : 'unable to delete Likes'})) 
    
};