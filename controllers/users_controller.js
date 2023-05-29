const db = require('../config/mongoose');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
module.exports.profile = async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        return res.render("user_profile", {
            title: "User Profile",
            profile_user: user
        });
    } catch (err) {
        console.log("cannot load profile page");
        return;
    }
};


// render the sign up page
module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_signup', {
        title: "Sign up"
    })
}
//render the sign in page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_signin', {
        title: "Sign in"
    })
}

//get the sign up data
module.exports.create = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            let user = await User.create(req.body);
            return res.redirect('/users/sign-in');
        }
        else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('error in creating user in signing up');
        return;
    }

}
/*
//sign in and create a new user session
module.exports.createSession = function (req, res) {
    //steps to authenticate
    //find the user
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('error in finding user in signing up'); return }
        //handle user found
        if (user) {
            //handle password which don't match
            if (user.password != req.body.password) {
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }
        else {
            //handle user not found
            return res.redirect('back');
        }
    });
}

*/
//sign in and create session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully.')
    return res.redirect('/');
}

//to sign out
module.exports.destroySession = function (req, res) {
    req.logout(function (error) {
        if (error) {
            return next(error);
        }
        req.flash('success', 'You have logged out.')
        return res.redirect("/");
    });
}

//to update user profile
module.exports.update = async function(req, res){
    try{
        if(req.user.id == req.params.id){
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log("*******MULTER ERROR: ", err)};
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
            })
            return res.redirect('back');
        }else{
            return req.status(401).send('Unauthorized');
        }
    }catch(err){
        console.log('Error in updating user profile')
    }
}