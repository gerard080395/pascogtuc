/**
 * Created by Gerard on 1/11/2017.
 */

/*var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var cartSchema  =  new Schema({

});


module.exports = mongoose.model('Cart',cartSchema);
    */

module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item,id) {
        var storedItem = this.items[id];
        if (!storedItem){
              storedItem = this.items[id] = {item:item , qty:0, productPrice:0};
        }
        storedItem.qty++;
        storedItem.productPrice = storedItem.qty * storedItem.item.productPrice;
        this.totalQty++;
        this.totalPrice += storedItem.item.productPrice;

    };

    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].productPrice-= this.items[id].item.productPrice;
        this.totalQty--;
        this.totalPrice-= this.items[id].item.productPrice;

        if(this.items[id].qty<=0){
            delete this.items[id];
        }
    };

    this.removeItem = function(id){
        this.totalQty -=this.items[id].qty;
        this.totalPrice -= this.items[id].productPrice;
        delete this.items[id];
    };

    this.augmentByOne= function(id){
        this.items[id].qty++;
        this.items[id].productPrice+= this.items[id].item.productPrice;
        this.totalQty++;
        this.totalPrice+= this.items[id].item.productPrice;
    };

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};