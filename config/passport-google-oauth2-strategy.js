const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url
}, async function(accessToken, refreshToken, profile, done){
    try{
        //find the user by first email in the array of emails
        let user = await User.findOne({email: profile.emails[0].value});
        console.log(profile);
        console.log(accessToken, refreshToken);
        //if user found return it
        if(user){
            return done(null, user);
        }else{
        //if user not found create then return it
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
            return done(null, user);
        }
    }catch(err){
        console.log("******ERROR in google strategy passport: ", err);
        return;
    }
}))


module.exports = passport;