const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function (req, res) {
    let post = await Post.find({}).populate('user').populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).sort({ 'createdAt': -1 });
    return res.json(200, {
        message: "List of posts",
        posts: post
    })
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if (post.user == req.user.id) {
            await Post.deleteOne({ _id: post._id });
            await Comment.deleteMany({ post: req.params.id });

            return res.json(200, {
                message: "Post and associated comments deleted"
            })
        }else{
            return res.json(401, {
                message: "You cannot delete this post"
            })
        }


    } catch (err) {
        return res.json(500, {
            message: "Internal server error"
        })
    }
}