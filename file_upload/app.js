const express = require('express')
const moment = require('moment')
const app = express()
const FileUpload = require('express-fileupload')
const path = require('path')


const fs = require('fs')
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

app.get('/get',function(req,res,next){

  let buffer = fs.readFileSync('public/files/1.pdf')
  return res.json(buffer)

})

app.get('/view',function(req,res,next){
  var stream = fs.createReadStream('public/files/2021-09-23_210046.pdf');

  var filename = "1.pdf"; 
  // Be careful of special characters

  filename = encodeURIComponent(filename);
  // Ideally this should strip them

  res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');
  
  stream.pipe(res);
  
})


app.post('/upload',function(req,res,next){

    const file = req.files.file
    console.log('file-->',file)
    
    console.log('filesize...')
    console.log(file.size)
    if(file.size > 1 * 1024 *1024){
        res.status(413).json({success:false,message:"File Size Limit is 1MB, you uploaded File exceeds file limit."})
      return;
    }



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
    console.log('Server Started at PORT 1000, Since '+date)
})