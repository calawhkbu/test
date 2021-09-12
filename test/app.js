const express = require('express')
const app = express()
const config = require ('./config.json')
const  jwt = require("jsonwebtoken");




const auth = require("./auth");
const reg = require("./reg")

app.get("/register",reg,(req,res)=>{
    const token = jwt.sign(
        { user_id: 1, isStaff:true, role:"operator" },
        config.TOKEN_KEY,
        {
          expiresIn: "99y",
        }
      );
     res.cookie("token",token,{
        expire:400000 + Date.now(),
        secure:false,
        httpOnly:true
    })
  

      res.status(201).send('reg ok')
})

app.get("/", auth, (req, res) => {
   
  res.status(200).send("Welcome 🙌 ");
});


app.get("/logout",(req,res)=>{
    res.clearCookie("token");


    res.status(200).send("Logout completed ");
})


app.listen(config.PORT,function(req,res){
    console.log("Server Started at PORT "+config.PORT+" Since "+new Date())
})
