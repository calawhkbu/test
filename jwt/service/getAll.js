


const express = require('express')
const app = express ()

// // Store the token in a cookie called '_csrf'
// var csrfProtection = csrf({ cookie: true })
// app.use(csrfProtection)

//     // Make the token available to all views
//     app.use(function (req, res, next){
//         res.locals.csrf = req.cookies.csrf;
//         next();
//     });



app.get('/data',function(req,res,next){
    res.json({success:true})

})


app.post('/data',function(req,res,next){

    res.json({success:true,method:'post'})
})


module.exports = app