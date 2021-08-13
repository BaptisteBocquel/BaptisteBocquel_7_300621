
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = process.env.SECRET_JWT;

module.exports = {
    generatedTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id,
            user_admin: userData.user_admin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },
    parseAuthorization: function(authorization){
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function(authorization){
        let userId = -1;
        const token = module.exports.parseAuthorization(authorization);
        if(token != null){
            try{
                const jwtToken = jwt.verify(token, JWT_SIGN_SECRET); 
                if(jwtToken != null)
                    userId = jwtToken.userId;
            } catch(err){ }
        }
        return userId;
    }
};