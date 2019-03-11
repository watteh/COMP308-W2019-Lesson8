let express = require('express');
let router = express.Router();
let passport = require('passport');
let mongoose = require('mongoose');

// define the user model
let userModel = require('../models/user');
let User = userModel.User; //alias

module.exports.displayHome = (req, res, next) => {
    res.render('index', {
        title: 'Home',
        displayName: req.user ? req.user.displayName : ''
    });
}

module.exports.displayAbout = (req, res, next) => {
    res.render('index', {
        title: 'About',
        displayName: req.user ? req.user.displayName : ''
    });
}

module.exports.displayServices = (req, res, next) => {
    res.render('index', {
        title: 'Services',
        displayName: req.user ? req.user.displayName : ''
    });
}

module.exports.displayProducts = (req, res, next) => {
    res.render('index', {
        title: 'Products',
        displayName: req.user ? req.user.displayName : ''
    });
}

module.exports.displayContact = (req, res, next) => {
    res.render('index', {
        title: 'Contact',
        displayName: req.user ? req.user.displayName : ''
    });
}

module.exports.displayLogin = (req, res, next) => {
    // Check if user is already logged in
    if (!req.user) {
        res.render('auth/login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    } else {
        return res.redirect('/');
    }
}

module.exports.processLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/contact-list');
        });
    })(req, res, next);
}

module.exports.displayRegister = (req, res, next) => {
    if (!req.user) {
        res.render('auth/register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    } else {
        return res.redirect('/');
    }
}

module.exports.processRegister = (req, res, next) => {
    // define a new User object
    let newUser = new User({
        username: req.body.username,
        // password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
    });

    User.register(
        newUser,
        req.body.password,
        (err) => {
            if (err) {
                console.log('Error: Inserting new user');
                if (err.name == "UserExistsError") {
                    req.flash('registerMessage', 'Registration Error: User already exists!');
                    console.log('Error: Inserting new user');
                }
                return res.render('auth/register', {
                    title: 'Register',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ''
                });
            } else {
                // if no error exists, then registration is successful
                // redirect the user
                return passport.authenticate('local')(req, res, () => {
                    res.redirect('/contact-list');
                });
            }
        }
    );
}

module.exports.performLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}