const express = require('express')
const moment = require('moment')
const app = express()

const root = require('path').resolve('./')
app.use(express.static('./public')) //allow static files



app.get('/',function(req,res,next){

    console.log(req)
    res.end('ok')
})


app.post('/upload',function(req,res,next){
    
})

app.listen(1000,function(res){
    var date = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log('Server Started at PORT 81, Since '+date)
})