let models = require('../models');
let auth = require('../middleware/auth');



exports.like = (req,res,next) => {
    //getting auth header
    let headerAuth = req.headers['authorization'];
    let userId = auth.getUserId(headerAuth);

    let messageId = parseInt(req.params.messageId);

    if (messageId <= 0){
        return res.status(400).json({ 'error': 'invalid parameters'}); //if idMessage valid or not
    }

    models.Message.findOne({
        where : { id: messageId }
    })
    .then(messageFound => {
        if(messageFound){
            models.User.findOne({
                where: { id: userId }
            })
            .then(userFound => {
               
                if(userFound){
                    models.Like.findOne({
                        where: {
                            userId: userId,
                            messageId : messageId,
                        }
                    })
                    
                    .then( isUserAlreadyLiked => {
                       if(!isUserAlreadyLiked){
                           messageFound.addUser(userFound)
                           .then(() => {

                               messageFound.update({
                                   message_likes: messageFound.message_likes + 1,
                               })
                               .then(messageFound => {
                                    if(messageFound){
                                        return res.status(201).json(messageFound);
                                    }else{
                                        return res.status(500).json({'error' : 'cannot update message'});
                                    }
                               })
                           })
                           .catch(() => res.status(500).json({'error': 'cannot update message like counter'}));
                       }else{
                           return res.status(409).json({'error':'message already liked'});
                       }
                    }) 
                    .catch(() => res.status(500).json({'error': 'unable to set user reaction'}));              
                }else{
                    return res.status(404).json({'error' : 'user not exist'})
                }
            })
            .catch(() => res.status(500).json({'error': 'unable to verify user'}));
        } else{
            return res.status(404).json({'error' : 'post already like'});
        }  
    })
    .catch(() => res.status(500).json({'error' : 'unable to verify Message'}));
};


exports.dislike = (req,res,next) => {
        //getting auth header
        let headerAuth = req.headers['authorization'];
        let userId = auth.getUserId(headerAuth);
    
        let messageId = parseInt(req.params.messageId);
    
        if (messageId <= 0){
            return res.status(400).json({ 'error': 'invalid parameters'}); //if idMessage valid or not
        }
    
        models.Message.findOne({
            where : { id: messageId }
        })
        .then(messageFound => {
            if(messageFound){
                models.User.findOne({
                    where: { id: userId }
                })
                .then(userFound => {
                   
                    if(userFound){
                        models.Like.findOne({
                            where: {
                                userId: userId,
                                messageId : messageId,
                            }
                        })
                        
                        .then( isUserAlreadyLiked => {
                           if(isUserAlreadyLiked){
                               isUserAlreadyLiked.destroy()
                               .then(() => {
    
                                   messageFound.update({
                                       message_likes: messageFound.message_likes - 1,
                                   })
                                   .then(messageFound => {
                                        if(messageFound){
                                            return res.status(201).json(messageFound);
                                        }else{
                                            return res.status(500).json({'error' : 'cannot update message'});
                                        }
                                   })
                               })
                               .catch(() => res.status(500).json({'error': 'cannot update message like counter'}));
                           }else{
                               return res.status(409).json({'error':'message already disliked'});
                           }
                        }) 
                        .catch(() => res.status(500).json({'error': 'unable to set user reaction'}));              
                    }else{
                        return res.status(404).json({'error' : 'user not exist'})
                    }
                })
                .catch(() => res.status(500).json({'error': 'unable to verify user'}));
            } else{
                return res.status(404).json({'error' : 'post already like'});
            }  
        })
        .catch(() => res.status(500).json({'error' : 'unable to verify Message'}));
};