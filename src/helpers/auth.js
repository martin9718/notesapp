//This is a middleware to validate the note routes if the user is authenticated
const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    //req.isAuthenticated is a passport method
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Not authorized');
    res.redirect('/users/signin');
};

module.exports = helpers;