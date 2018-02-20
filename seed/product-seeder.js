/**
 * Created by Gerard on 11/8/2016.
 */
var Product = require('../models/product');
var mongoose = require('mongoose');

var mongodb = 'localhost:27017/test/shopping';
//重点在这一句，赋值一个全局的承诺。
mongoose.Promise = global.Promise;
var db = mongoose.connect(mongodb);


var products = [
    new Product({
    productImagePath:'',
    productId:'P01',
    productTitle:'Washing machine XND',
    productDescription:'Washing machine XND with 2.5Kg maximum clothes allowed',
    productFabricationDate:'01/01/2016',
    productExpirationDate:'01/01/2020',
    productPrice:800
}),
    new Product({
        productImagePath:'',
        productId:'P02',
        productTitle:'Binatone Blender',
        productDescription:'Binatone blender with 2.5L capacity to make your best dishes!!!',
        productFabricationDate:'12/01/2016',
        productExpirationDate:'15/02/2020',
        productPrice:120
    }),
    new Product({
        productImagePath:'',
        productId:'P03',
        productTitle:'Air Conditioner',
        productDescription:'Portable Air Conditioner with intelligent cooling system ',
        productFabricationDate:'01/01/2000',
        productExpirationDate:'01/11/2010',
        productPrice:550
    }),
    new Product({
        productImagePath:'',
        productId:'P04',
        productTitle:'Smart TV Samsung',
        productDescription:'Smart TV 32 inches,LED with 3 USB ports',
        productFabricationDate:'11/11/2014',
        productExpirationDate:'01/01/2020',
        productPrice:2500
    })

];

var done =0;
for(var i=0;i<products.length;i++){
    products[i].save(function(err,result){
        done++;
        if(done===products.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
    console.log('Seed saved in the database');
}

