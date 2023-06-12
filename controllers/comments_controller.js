const Comment = require('../models/comment');
const Post = require('../models/post')
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');
module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            //commentsMailer.newComment(comment);
            let job = queue.create('email', comment).save(function(err){
                if(err){console.log('*******error in enqueue the newComment', err); return}

                console.log('Job enqueued', job.id);
            })


            return res.redirect('back');
        }

    }catch(err){
        console.log("Error in creating the comment");
        return res.redirect('back');
    }
}
module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user.toString() == req.user.id){
            let postId = comment.post;
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            await Comment.deleteOne({_id: comment._id});
            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            return res.redirect('back');
        }

    }catch(err){
        console.log("Error in deleting comment");
        return res.redirect('back');
    }
}