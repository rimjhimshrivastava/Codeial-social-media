const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user:'codeialmedia69@gmail.com',
        pass:'lfuxfhmwvqtlsjcc'
    }
});

let renderTemplate = (data, relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, tempelate){
            if(err){console.log("Error in rendering tempelate", err); return};
            mailHTML = tempelate;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}