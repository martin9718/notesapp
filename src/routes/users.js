const express = require('express');
const router = express.Router();
const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

//This method is using the configuraation we made in the passport.js file 
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes', //If the authentication is success redirect to notes
    failureRedirect: '/users/signin', //If the authentication is  not success redirect to notes
    failureFlash: true // Allows to send messages
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async(req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (name.length <= 0 || email.length <= 0 || password.length <= 0) {
        errors.push({ text: 'All fields are required' })
    }
    if (password != confirm_password) {
        errors.push({ text: 'Password do not match' });
    }
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            error_msg = 'The email is alredy in use';
            res.render('users/signup', { error_msg, name, email, password, confirm_password });

        } else {
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            res.redirect('/users/signin');
        }

    }

});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});



module.exports = router;