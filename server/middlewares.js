const expressSession = require('express-session');
const mongoose = require("mongoose");
const conectionStr = 'mongodb://127.0.0.1:27017/EnduroSAT';
const {ReactAppOrigin, ExpressSessionSecretKey} = require('./global-variables.js');

function starDataBase() {

    try {
        mongoose.connect(
            conectionStr, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log('>>> Database conected to Compass')

    } catch (err) {
        console.error('>>> DataBase Not Working:' + err.message);
    };

   //Errors after initial conection:
    const db = mongoose.connection;

    db.on('error', err => {
        console.error('>>> Database error:' + err.message);
    });
    db.on('open', () => {
        console.log('>>> Database conected');
    });
};


function Middlewares(server, express) {

    //starDataBase()

    server.use(express.json());

    server.use(
        express.urlencoded({ extended: false })
    );

    server.use(expressSession({
        secret: ExpressSessionSecretKey,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    }))

    server.use((req, res, next) => {
        console.log("pryflight")
        res.setHeader('Access-Control-Allow-Origin', ReactAppOrigin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        next();
    });

};

module.exports = Middlewares;