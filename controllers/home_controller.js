const Post = require('../models/post');
const User = require('../models/user')
module.exports.home = async function(req, res){
   // console.log(req.cookies);
   // res.cookie('user_id', 25);
   try{
      //populate the user for each post
      let post = await Post.find({}).populate('user').populate({
         path: 'comments',
         populate: {
            path: 'user'
         }
      }).sort({'createdAt':-1});
      let user = await User.find({});
      return res.render('home', {
         title: "HOME",
         post_list: post,
         user_list: user
      })

   }catch(err){
      console.log("Error in loading the home page");
      return;
   }
};

// SYNTAX: module.exports.actionName = function(req, res){};