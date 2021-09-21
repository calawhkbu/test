const express = require('express')
const moment = require('moment')
const app = express()
const FileUpload = require('express-fileupload')
const path = require('path')

const root = require('path').resolve('./')
app.use(express.static('./public')) //allow static files

app.use(FileUpload({
    useTempFiles : true,
    tempFileDir : './tmp/'
}));



app.get('/',function(req,res,next){

    console.log(req)
    res.end('ok')
})


app.post('/upload',function(req,res,next){

    const file = req.files.file
    console.log('file-->',file)
    



     const ext = path.extname(file.name)
    const fileName= moment().format('YYYY-MM-DD_HHmmss')
    const uploadPath = root+'/public/files/'+fileName+ext

    file.mv(uploadPath, function(err) {
        if (err)
          return res.status(500).json({success:fail,message:err});
    
        res.json({success:true,message:'File uploaded!'});
      });
    
    
})

app.listen(1000,function(res){
    var date = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log('Server Started at PORT 81, Since '+date)
})