const express = require('express')
const app = express();

//const api = require('./api')



app.use(express.static('www'))
app.get('/',function(req,res,next){

    res.end('Ok')

})


app.listen(81,function(){
    console.log(`Server started at PORT 81 Since ${new Date()}`)
})