const express = require('express')
const app = express()
const config = require('./config.json')

//serve static files 
app.use(express.static('www'))


app.get('/pdf/:fileName', async function (req, res, next) {


    var PDFImage = require("pdf-image").PDFImage;
    var pdfImage = new PDFImage('./www/'+req.params.fileName);


    var path = []
    var len = 0;
    const fs = require('fs');
    const pdf = require('pdf-page-counter');
    let dataBuffer = fs.readFileSync('./www/'+req.params.fileName);

    pdf(dataBuffer).then(async function (data) {
        len = data.numpages
        console.log(len)
        // number of pages
        for (i = 0; i <= len; i++) {
            await pdfImage.convertPage(i).then(function (imagePath) {
                imagePath = imagePath.replace('www/', '')
                path.push(imagePath)
            }, function (err) {
                res.status(500).end(err);
            });
            if (i+1 == len) {
                console.log(path)
                res.json(path)
            }
        }
    
    });

  

})


app.listen(config.PORT, function (req, res) {
    console.log('Server Started At ' + new Date + "Port: " + config.PORT)
})