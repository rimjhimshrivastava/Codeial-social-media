const User = require('../../../models/user');
const jwt = require('jsonwebtoken');


//sign in and create session for the user
module.exports.createSession = async function (req, res) {
    try{
        console.log(req.body);
        let user = await User.findOne({email: req.body.email});
        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid username or password"
            })
        }
        return res.json(200, {
            message: "Sign in successful! token returned",
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '600000'})
            }
        })
    }catch(err){
        console.log("********ERROR jwt controller:", err);
        return res.json(500,{
            message: "Internal Server Error"
        })
    }
}
