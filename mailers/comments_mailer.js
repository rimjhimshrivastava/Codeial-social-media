const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method
exports.newComment = async (comment) => {
    try {
        let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
        let info = await nodeMailer.transporter.sendMail({
            from: 'codeialmedia69@gmail.com',
            to: comment.user.email,
            subject: "New comment published!",
            html: htmlString
        });
        console.log("Mail delivered", info);
        return;
    } catch (err) {
        console.log("*****error in newComment mailer", err);
        return;
    }
}