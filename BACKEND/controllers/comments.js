let models = require('../models');
let auth = require('../middleware/auth');

exports.createComment = (req,res,next) => {
    //getting auth header
    let headerAuth = req.headers['authorization'];
    let userId = auth.getUserId(headerAuth);

    let messageId = parseInt(req.params.messageId);
    
    let comments_content = req.body.comments_content;

    if (messageId <= 0){
        return res.status(400).json({ 'error': 'invalid parameters'}); //if idMessage valid or not
    }

    models.Message.findOne({
        where : { id: messageId }
    })
    .then(messageFound => {
        if(messageFound){
            models.Comment.create({
                messageId: messageId,
                userId: userId,
                comments_content: comments_content
            })
            .then(newComment => {
                return res.status(201).json(newComment);
            })
            .catch(() => res.status(500).json({'error' : 'cannot post comment'}))      
        } else{
            return res.status(404).json({'error' : 'Message not exist'});
        }  
    })
    .catch(() => res.status(500).json({'error' : 'unable to verify Message'}));
};