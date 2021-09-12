const express = require('express')
const app = express () 
const config = require ('./config.json')

//serve static files 
app.use(express.static('www'))


app.get('/pdf',async function(req,res,next){
  

    var PDFImage = require("pdf-image").PDFImage;
    var pdfImage = new PDFImage('./www/1.pdf');

    
    var path=[]
 for(i=0;i<=2;i++){
    await pdfImage.convertPage(i).then(function (imagePath) {
        imagePath=imagePath.replace('www/','')
        path.push(imagePath)
        }, function (err) {
          res.send(err, 500);
        });
        if(i==2){
            console.log(path)
            res.jsonp(path)
            res.end()
        }
 }
  

})


app.listen(config.PORT,function(req,res){
    console.log('Server Started At '+new Date + "Port: "+config.PORT)
})