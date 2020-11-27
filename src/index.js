require('./config/config');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Initializations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({ extended: false })); //Used instead of body parser
app.use(methodOverride('_method')); //This method allows making http requests like PUT or DELETE
app.use(session({ // Allows create sessions for clients
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize()); //Passport configurations
app.use(passport.session()); //Passport configurations
app.use(flash()); // Allows you to send messages to users


//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'); //Global variables that store flash messages
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); //Passport flash messages 
    res.locals.user = req.user ? JSON.parse(JSON.stringify(req.user)) : null; //Passport saves in an object the authenticated user information

    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Server is listenning
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});