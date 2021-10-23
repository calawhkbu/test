const email = require('./email/index')
const config = require('./config.json')
const express = require('express');
const app = express()
const cron = require('node-cron')
const chalk = require('chalk')

app.use('*', function (req, res, next) {
    res.end('nodemailer running')


})



app.listen(80, function (res) {

    console.log('Server Started at PORT 80, Since ' + new Date())
    cron.schedule('*/5 * * * * *', () => {
        console.log(new Date())


        let html = "<p> Demo <b> Email</b>";
        var message = {
            to: 'issactang@gmail.com',
            subject: "Demo Email",
            html
        }

        

        email.sendMail(message, function (err, info) {
            if (err) {
                return console.log('Error ' + err)
            }
            console.log(chalk.yellow(__filename))
            console.log(chalk.green('Email Sent'))
        })


    })
})



module.exports = app