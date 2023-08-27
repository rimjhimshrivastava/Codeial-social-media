const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method
exports.newPost = async (post) => {
    try {
        let htmlString = nodeMailer.renderTemplate({post: post}, '/post/new_post.ejs');
        let info = await nodeMailer.transporter.sendMail({
            from: 'codeialmedia69@gmail.com',
            to: post.user.email,
            subject: "New post has been published!",
            html: htmlString
        });
        return;
    } catch (err) {
        console.log("*****error in newPost mailer", err);
        return;
    }
}