const express = require('express')
const moment = require('moment')
const app = express()
const path = require('path')

const root = require('path').resolve('./')
app.use(express.static('./public')) //allow static files





app.get('/',function(req,res,next){

    console.log(req)
    res.end('ok')
})




app.listen(80,function(res){
    var date = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log('Server Started at PORT 80, Since '+date)
})