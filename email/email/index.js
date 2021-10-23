const nodemailer = require('nodemailer')
const root = require('path').resolve('./')
const config = require( "../config.json")

let transport = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    service:"Gmail",
    pool:true,
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    }
});

module.exports = transport