//firing an express server
//we can start the server with 'npm start', since we's set the start script at package.json
const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
const port = 8000;
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportlocal = require('./config/passport-local-strategy');
const passportjwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//set up chat server, being used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000, function(err){
    if(err){console.log("Error chat server:", err); return}
    console.log("chat server is listening on port: 5000");
});
const path = require('path');

//necessary for cross origin resource sharing
app.use(cors());

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, '/scss'),
        dest: path.join(__dirname, env.asset_path, '/css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}


app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//tell our server to use the layout library before the routes
app.use(expressLayouts);
//tell where to look out for startic files
app.use(express.static(path.join(__dirname, env.asset_path)));
//route for uploads path
app.use('/uploads', express.static(__dirname +'/uploads'));


//keeping logs of activity of users
app.use(logger(env.morgan.mode, env.morgan.options))



//extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
//middleware to encrypt the cookie
app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production node
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1/codial_development',
        autoRemove: 'disabled'
    }, function(err){console.log(err || 'connect-mongodb setup ok');})
}
));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);


app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`); //interpolation, using backticks
    }
    console.log(`Server is running on port: ${port}`);
})