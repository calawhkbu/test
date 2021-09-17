/*
1. Test Api EndPoit
2, View Form
3. Other Router 
4. Ajax call
*/
//CSRF
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')

const express = require('express')
const app = express ()

const base = require('./router/base')
const getAll = require('./service/getAll')


//Setup middleware for CSURF
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })
app.use(cookieParser())
app.use(csrfProtection)

app.set('view engine', 'ejs');


//init csrf token
app.all('*', function (req, res,next) {
    res.cookie('csrf', req.csrfToken())
    next()
  })

app.use(base)
app.use(getAll)


app.get('/',csrfProtection,function(req,res,next){

    res.render('pages/index',{csrf:req.cookies.csrf})
})

app.listen(80,function(){
    console.log('Server Started PORT 80, Since '+new Date())
})