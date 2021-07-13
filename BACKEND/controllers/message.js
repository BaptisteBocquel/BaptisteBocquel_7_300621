const models = require('../models');
const auth = require('../middleware/auth');


const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT = 50;



exports.createMessage = (req,res,next) => {
    //getting auth header
    let headerAuth = req.headers['authorization'];
    console.log(headerAuth);
    let userId = auth.getUserId(headerAuth);
    
    //Params
    
    let message_title = req.body.message_title;
    let message_content = req.body.message_content;
    var message_attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; //req.file.filename

    
    /*if(req.body.youtube_link){
        var message_attachment = req.body.youtube_link;
    }
    if(req.body.image){
        var message_attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; //req.file.filename
    }else{
        var message_attachment = "";
    }*/
    //console.log(req.body.message_attachment);
    /*if(req.body.message_attachment == undefined ){
        var message_attachment = "";
    }else{
        var message_attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; //req.file.filename
        
    }*/

    if(message_title == null || message_content == null){
        return res.status(400).json({ 'error' : 'missing parameters'});
    }

    if(message_title.length <= TITLE_LIMIT || message_content.length <= CONTENT_LIMIT){
        return res.status(400).json({ 'error' : 'invalid parameters'});
    }

    models.User.findOne({
        where: { id: userId }
    })
    .then(userFound => {
        if(userFound){
            console.log(userFound)
            models.Message.create({
                message_title : message_title,
                message_content: message_content,
                message_attachment: message_attachment,
                message_likes : 0,
                UserId : userFound.id,
                //user_pseudo : userFound.user_pseudo
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
    //let fields = req.query.fields; //SELCT COLUMN WE WOULD DISPLAY
    //let limit = parseInt(req.query.limit); // USERS CANT GET ALL MESSAGES AT THE SAME TIME
    //let offset = parseInt(req.query.offset); // IDEM
    let order =req.query.order; // ORDER MESSAGES
    
    /*if(limit > ITEMS_LIMIT){
        limit = ITEMS_LIMIT;
    }*/
    models.Message.findAll({
        order: [
            ['id', 'DESC'],
            
        ],
        /*order : [(order != null) ? order.split(':') : ['message_title', 'ASC']],
        attributess : (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,*/
        include : [{
            model : models.User,
            attributes: ['user_pseudo']
        }]
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
};

exports.deleteMessage = (req,res,next) => {
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
                if(userFound == us){
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
                }else{
                    return res.status(404).json({'error' : 'You cannot delete message from another user'})
                }
            })
            .catch(() => res.status(500).json({'error': 'unable to verify user'}));
        } else{
            return res.status(404).json({'error' : 'message don\'t exist'});
        }  
    })
    .catch(() => res.status(500).json({'error' : 'unable to verify Message'}));
};