const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        //if request is AJAX, then return JSON object
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        };
        return res.redirect('back');
    } catch (err) {
        console.log('Error in creating a post');
        return res.redirect('back');
    }
};

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        // using req.user.id instead of req.user._id because mongoose allows us to convert the id into a string
        if (post.user.toString() == req.user.id) {
            console.log("DELETED POST",post._id);
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            for(let comment of post.comments){
                await Like.deleteMany({likeable: comment, onModel: 'Comment'});
            }

            await Post.deleteOne({_id: post._id});
            await Comment.deleteMany({ post: req.params.id });
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                })
            }
        }
        return res.redirect('back');

    } catch (err) {
        console.log('ERROR in deleting the post')
        return res.redirect('back');
    }
}

