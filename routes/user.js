
/**
 * Created by Gerard on 1/10/2017.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressValidator = require('express-validator');
var PDFDocument = require('pdfkit'); // add pdfkit module to access it
var path=require('path'); //  add path module to get path
var fs = require('fs');
var phantom = require('phantom');
//var Order = require('../models/order');
var Cart = require('../models/cart');

//import module for mail contact-form
//var mailer = require('node-mailer');

//import csurf for session protection
var csrf = require('csurf');
var csrfProtection = csrf();

//solving req.checkBody typeError
router.use(expressValidator());

router.use(csrfProtection);

router.get('/contact',function (req,res,next) {
    res.render('user/contact',{csrfToken: req.csrfToken()});
});

router.post('/contact',function (req,res,next) {
    var feedback = req.flash('info', 'Email message sent');
    var api_key = 'key-1c88e21ba64c9762d011f4c3382485dc';
    var domain = 'sandboxb08aa32f4d05499397facdf33662a14e.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

    var data = {
        from: 'GhSupermarket client review <postmaster@sandboxb08aa32f4d05499397facdf33662a14e.mailgun.org>',
        to: 'gerardinog@yahoo.fr',
        subject: req.body.subject,
        text: req.body.message
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
        req.flash('info', 'Email message sent');
        if(error){
            res.redirect('user/contact');
        }
        res.render('user/contact',{feedback: req.flash('info')[0]});
    });
});


router.get('/receipt',isLoggedIn,function (req,res,next) {
    Order.find({user: req.user},function (err,orders) {
        if(err){
            //return res.write('An error has occured when retrieving user order');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
            order.time= order.time.toUTCString();
        });
        res.render('user/profile',{title:'1',order: orders[0]});
    });
});

router.get('/history',isLoggedIn,function (req,res,next) {
    Order.find({user: req.user},function (err,orders) {
        if(err){
            //return res.write('An error has occured when retrieving user order');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
            order.time= order.time.toUTCString();
        });
        res.render('user/history',{title:'1',orders: orders});
    });
});


router.get('/receipt/:id',function (req,res,next) {
    Order.findById(req.params._id,function (err,order) {
        if(err){
            console.log(err);
        }
        res.render('user/receipt',{layout:false,order:order});
    });
});


/*router.get('/print/:id',function (req,res,next) {
 Order.findById(req.params.id,function (err,order) {

 if(err){
 console.log(err);
 }
 console.log("************************************");
 console.log(order);
 res.render('user/receipt',{order: order});
 });
 });*/

router.get('/save',function(req,res,next){
    phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
            page.open("http://www.google.com").then(function(status) {
                page.render('google.pdf').then(function() {
                    console.log('Page Rendered');
                    ph.exit();
                });
            });
        });
    });
});

router.get('/logout',isLoggedIn,function (req,res,next) {
    req.logout();
    res.redirect('/');
});

router.use('/',isLoggedOut, function (req,res,next) {
    next();
});

router.get('/signup',function (req,res,next) {
    var messages = req.flash('error');
    res.render('user/signup',{ csrfToken: req.csrfToken(), messages: messages,hasErrors: messages.length>0 });
});

router.post('/signup',passport.authenticate('local.signup',{
    failureRedirect:'/user/signup',
    failureFlash: true
}),function (req,res,next) {
    var oldUrl = req.session.oldUrl;
    if(req.session.oldUrl){
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}),function (req,res,next) {
    var oldUrl = req.session.oldUrl;
    if(req.session.oldUrl){
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect('/user/history');
    }
});

/* Authentication for users using facebook authentication procedure*/

router.get('/auth/facebook', passport.authenticate('facebook',{scope: 'email'}));

router.get('/auth/facebook/callback', passport.authenticate('facebook',{ failureRedirect: '/signin' }), function(req, res) {
    // Successful authentication, redirect home.
        res.redirect('/');
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function isLoggedOut(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;
