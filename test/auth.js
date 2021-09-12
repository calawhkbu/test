const jwt = require("jsonwebtoken");
const config = require('./config.json')

const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require ('express')
const verifyToken = express();
verifyToken.use(express.json());
verifyToken.use(cors());
verifyToken.use(cookieParser());

verifyToken.get("/",function(req,res,next){
console.log("req --> "+req.cookies.token)
const token = req.cookies.token || ""
if(!token || token ==""){
    res.status(401).send("Token Required")
}
     const decoded = jwt.verify(token, config.TOKEN_KEY);
if(decoded){
    next();

}else{
    res.status(401)

}

})

// const verifyToken = (req, res, next) => {
//     console.log("req -->"+req.cookie)



// //   const token =
// //     req.body && req.body.token || req.query && req.query.token || req .headers && req.headers["x-access-token"]||req.cookie.token

// const token =""

// //var token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpc1N0YWZmIjp0cnVlLCJyb2xlIjoib3BlcmF0b3IiLCJpYXQiOjE2MzE0MjU3ODksImV4cCI6NDc1NTYyODE4OX0.f0z4p1CWChZ613Y0N9th05cfPoWm-inARHwpnhGOTFU"

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, config.TOKEN_KEY);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

module.exports = verifyToken;