var express = require('express');
var fs = require('fs');
var multer = require('multer');
var router = express.Router();
var Paper = require('../models/paper');
//var Cart  = require('../models/cart');
//var Order = require('../models/order');
var mongo = require('mongodb');
var async = require('async');

/* GET home page. */
/*router.get('/', function(req, res, next) {
 var successMsg  = req.flash('success')[0];
 //sending product list to the front end

 Product.find(function(error,documents){
 var size = 2;
 var productChunk = [];
 for(var i = 0;i<documents.length;i+=size){
 productChunk.push(documents.slice(i,i+size));

 }
 res.render('shop/index', {  products:documents,successMsg:successMsg,noMessage:!successMsg });

 });
 });*/

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb(null, './public/uploads');
        cb(null,'./PDF/');
    },
    filename: function (req, file, cb) {

        var name= "pic"+req.body.paperCourseCode+""+req.body.paperYear+""+req.body.paperMonth+"index"+".pdf";
        cb(null,name);
        console.log('GOING TO DISPLAY IMPORTANT VALUE????????');
        console.log(name);
        console.log("Pictures have been uploaded");
    }
});

var upload = multer({ storage: storage });

router.get('/', function(req, res, next) {
    var successMsg  = req.flash('success')[0];
    res.render('shop/index',{successMsg:successMsg,noMessage:!successMsg});

});

router.get('/informatics/100',function (req,res,next) {
    Paper.find()
        .where('paperFacultyName','Informatics')
        .where('paperLevel','100')
        .exec(function (err,data) {
            if(err){
                console.log(err);
            }
            res.render('shop/papers',{layout:false,pageInfo:"Informatics L100" , papers : data});
        });
});

router.get('/informatics/200',function (req,res,next) {
    Paper.find()
        .where('paperFacultyName','Informatics')
        .where('paperLevel','200')
        .exec(function (err,data) {
            if(err){
                console.log(err);
            }
            res.render('shop/papers',{layout:false,pageInfo:"Informatics L200" , papers : data});
        });
});

router.get('/informatics/300',function (req,res,next) {
    Paper.find()
        .where('paperFacultyName','Informatics')
        .where('paperLevel','300')
        .exec(function (err,data) {
            if(err){
                console.log(err);
            }
            res.render('shop/papers',{layout:false,pageInfo:"Informatics L300" , papers : data});
        });
});

router.get('/informatics/400',function (req,res,next) {
    Paper.find()
        .where('paperFacultyName','Informatics')
        .where('paperLevel','400')
        .exec(function (err,data) {
            if(err){
                console.log(err);
            }
            res.render('shop/papers',{layout:false,pageInfo:"Informatics L400" , papers : data});
        });
});

router.get('/telecom/100',function (req,res,next) {

});

/*router.get('/paper/:id',function (req,res,next) {
    Paper.findById(req.params.id, function (err, paper){
        if(err){
            console.log('An error has occured when retrieving file');
            console.log(err);
        }
        res.render('shop/read',{paper:paper});
    });

});
*/

router.get('/paper/:id',function (req,res,next) {
    Paper.findById(req.params.id, function (err, paper){
        if(err){
            console.log('An error has occured when retrieving file');
            console.log(err);
        }
        //console.log(__dirname);
        fs.readFile(__dirname + paper.paperPdfPath , function (err,data){
            if(err){
                console.log(err);
            }
            res.contentType("application/pdf");
            res.send(data);
        });
    });
});

router.get('/insert',function (req,res,next) {
    res.render('shop/insert');
});

router.post('/insert',upload.any(),function (req,res,next) {
    var item ={
             paperPdfPath : "/../PDF/pic"+req.body.paperCourseCode+""+req.body.paperYear+""+req.body.paperMonth+"index"+".pdf",
             paperFacultyName : req.body.paperFacultyName,
             paperLevel: req.body.paperLevel,
             paperMidSem : req.body.paperMidSem,
             paperEndSem :req.body.paperEndSem,
             paperResit : req.body.paperResit,
             paperLecturerName : req.body.paperLecturerName,
             paperCourseCode : req.body.paperCourseCode,
             paperCourseTitle: req.body.paperCourseTitle,
             paperYear:req.body.paperYear,
             paperMonth : req.body.paperMonth,
             paperDescription : req.body.paperDescription
    };

    var paperEntry = new Paper(item);
    paperEntry.save(function (err) {
        if(err){
            console.log("ERROR LOG FILE");
           return console.log(err);
        }
        console.log("paper was uploaded" );
        res.redirect('/');
    });

});

router.post('/create-product',upload.single('picture'),function (req,res,next) {
    /*info is the name of a global variable created to hold picture name*/
    var newItemPath = '../uploads/'+info;
    /* clearing cache path variable*/
    info="";
    req.checkBody('productTitle', 'Product Title should be at least 3 characters long').notEmpty().isLength({min:2});
    req.checkBody('productDescription', 'Description not explicit enough').notEmpty().isLength({min:10});
    req.checkBody('productPrice', 'Invalid Price').notEmpty();
    //req.checkbody('picture','Product Image Upload is compulsory').notEmpty();
    /* Checking the existence of a product with the same Title*/
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        req.flash('error', messages);
        return res.redirect('create-product');
        /* With updates i m planning to store the values in cookies for the form not to clear out*/
    }
    Product.findOne({'productTitle': req.body.productTitle}, function (err, productResult) {
        if (err) {
            return console.log(err);
        }
        if (productResult) {
            req.flash('error','Existing product');
            return res.redirect('create-product');
        }
        var newItem= {
            productTitle : req.body.productTitle,
            productImagePath : newItemPath,
            productDescription: req.body.productDescription,
            productFabricationDate: req.body.productFabricationDate,
            productExpirationDate : req.body.productExpirationDate,
            productPrice : req.body.productPrice,
            categoryName : req.body.productCategory
        };
        console.log(newItem);
        var data = new Product(newItem);
        data.save();
        /* if(err){
         req.flash('error',err.message);
         }*/
        console.log('Item has been added');
        console.log(info);
        req.flash('success','Product Created Successfully');
        res.redirect('/');
    });

});

/*implementating search narrowing functionality depending on chosen category*/
router.get('/search/:id',function (req,res,next) {
    var successMsg  = req.flash('success')[0];
    var locals={};
    var tasks=[];
    var categoryName;
    var retrieveProducts= function (callback) {
        Category.findById(req.params.id,function(err,doc){
            if(err){
                callback(err);
            }
            categoryName = doc.categoryName;
            Product.find({$where:"this.categoryName=='" + categoryName + "'"},function (error,products) {
                if(error){
                    callback(error);
                }
                locals.products = products;
                callback(null,products);
            });
        });
    }
    var retrieveCategories = function (callback) {
        Category.find({},function (err,categories) {
            if(err){
                callback(err,null);
            }
            locals.categories = categories;
            callback(null,categories);
        });
    }

    tasks.push(retrieveProducts);
    tasks.push(retrieveCategories);

    async.parallel(tasks,function(err,results){
        if(err){
            callback(err,null);
        }
        console.log(results);
        res.render('shop/search',{name:categoryName,categories: locals.categories, products: locals.products,successMsg:successMsg,noMessage:!successMsg});
    });

});

/*implementating search narrowing functionality depending on location ********/
/*router.get('/search/:id',function (req,res,next) {
 var successMsg  = req.flash('success')[0];
 mongo.connect('mongodb://127.0.0.1/shopping', function(err, db) {
 var locals = {};
 var tasks = [
 // Load products
 function(callback) {
 //finding corresponding category name
 var categoryName;
 Category.findById(req.params.id,function (err,doc) {
 if(err){
 console.log('Couldn\'t find category');
 }
 categoryName = doc.categoryName;
 console.log(categoryName);
 console.log('Going to execute twisted mongo-mongoose function');

 db.collection('products').find({"categoryName" : categoryName}).toArray(function(err, users) {
 if (err) return callback(err);
 locals.products = users;
 callback();
 });
 });
 },
 // Load categories
 function(callback) {
 db.collection('categories').find({}).toArray(function(err, colors) {
 if (err) return callback(err);
 locals.categories = colors;
 callback();
 });
 }
 ];
 async.parallel(tasks, function(err) { //This function gets called after the two tasks have called their "task callbacks"
 if (err) return next(err); //If an error occurred, let express handle it by calling the `next` function
 // Here `locals` will be an object with `users` and `colors` keys
 // Example: `locals = {users: [...], colors: [...]}`
 db.close();
 console.log(locals.products);
 console.log(locals.categories);
 res.render('shop/search',{categories: locals.categories, products: locals.products,successMsg:successMsg,noMessage:!successMsg});

 });
 });
 });
 */

module.exports = router;

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

function cartEmpty(req,res,next){
    if(req.session.cart){
        return next();
    }
    res.redirect('/shopping-cart');
}