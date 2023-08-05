const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

//keeping logs in a new folder
const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

//user is accessing the website, the logs will be stored 
const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory
});


const development = {
    name: "development",
    asset_path: './assets',
    session_cookie_key: process.env.codeial_session_cookie_key,
    db: 'codial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.codeial_smtp_auth_user,
            pass: process.env.codeial_smtp_auth_pass
        }
    },
    google_client_id: process.env.codeial_google_client_id,
    google_client_secret: process.env.codeial_google_client_secret,
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: process.env.codeial_jwt_secret,
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: "production",
    asset_path: process.env.codeial_assets_path,
    session_cookie_key: process.env.codeial_session_cookie_key,
    db: 'codial_production',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.codeial_smtp_auth_user,
            pass: process.env.codeial_smtp_auth_pass
        }
    },
    google_client_id: process.env.codeial_google_client_id,
    google_client_secret: process.env.codeial_google_client_secret,
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: process.env.codeial_jwt_secret,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.NODE_ENV) == undefined? development: eval(process.env.NODE_ENV);