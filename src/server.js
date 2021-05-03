require('dotenv').config();
import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectFlash from "connect-flash";
import session from "express-session";
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })



let app = express();


// enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//config session
app.use(cookieParser ('secret'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie:{
        maxAge: 160 * 60 * 1000 //86400000 1hour
    }
}));

//Config passport middleware
//app.use(passport.initialize());
//app.use(passport.session());

//enable flash meessage
app.use(connectFlash());

//Config view engine
configViewEngine(app);

// init all web routes
initWebRoutes(app);




let port = process.env.PORT || 80;
app.listen(port, () =>console.log(`Server on port ${port}!`));
