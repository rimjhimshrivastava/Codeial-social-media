const queue = require('../config/kue');

const postMailer = require('../mailers/post_mailer');

queue.process('email', function(job, done){
    postMailer.newPost(job.data);

    done();
});