const express = require('express')
const moment = require('moment')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const fs = require('fs')

const root = require('path').resolve('./')
app.use(express.static('./public')) //allow static files

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(fileUpload());



app.get('/', function (req, res, next) {

    console.log(req)
    res.end('ok')
})

app.post('/upload', function (req, res, next) {
    const file = req.files.file
    console.log(file)
    console.log(file.name)

    const LIMIT_MB=2

    if(file.size > LIMIT_MB * 1024 * 1024) {
        return res.status(413).json({success:false,message:"Exceeds File Size Limit "+ LIMIT_MB+" MB"})

    }


    var uploadPath = root + '/public/' + file.name;
    file.mv(uploadPath, function (err) {
        if (err) {
            res.json({ success: false, message: "fail to upload File "+err })

        } else {
            res.json({ success: true })

        }
    })
})




app.listen(80, function (res) {
    var date = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log('Server Started at PORT 80, Since ' + date)
})