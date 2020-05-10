const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       // cas ou non recupere le token de req headers avec suppresion de "Bearer "
       const token = req.headers.authorization.split(" ")[1];
       console.log(token);
       const decoded = jwt.verify(token, process.env.JWT_KEY);
       // en cas ou on recupere token de requette body
       // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
       req.userData = decoded;
       next();
   }  catch (error) {
       return res.status(401).json({
           message: 'Auth failed... token false'
       })
   }
};