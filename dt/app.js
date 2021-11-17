const express = require('express')
const app = express();

//const api = require('./api')

app.get('/',function(req,res,next){
    
    console.log(req.protocol)

    res.end('https://'+req.get('host')+req.url)

})

app.use(express.static('www'))
app.get('/',function(req,res,next){
    

    res.end('Ok')

})


app.listen(81,function(){
    console.log(`Server started at PORT 81 Since ${new Date()}`)
})