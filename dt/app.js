const express = require('express')
const app = express();

const api = require('./api')



app.use(express.static('www'))
app.get('/',function(req,res,next){

    res.end('Ok')

})
app.use(api)


app.listen(80,function(){
    console.log(`Server started at PORT 80 Since ${new Date()}`)
})