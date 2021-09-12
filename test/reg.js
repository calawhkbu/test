const  jwt = require("jsonwebtoken");
const config = require('./config.json')
const express = require("express")
const app = express()
const cookieParser = require('cookie-parser');
app.use(cookieParser())


app.post('/',async(req,res)=>{
    const token = jwt.sign(
        { user_id: 1, isStaff:true, role:"operator" },
        config.TOKEN_KEY,
        {
          expiresIn: "99y",
        }
      );
      res.cookie("token",token,{
          expires:new Date().now()+100,
          secure:false,
          httpOnly:true
      })

      res.json(token)
    

})

  
  module.exports = app 
