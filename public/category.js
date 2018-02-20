/**
 * Created by Gerard on 11/15/2016.
 */
/**
 * Created by Gerard on 11/15/2016.
 */
var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var schema = new Schema({

        categoryId: {type:String , required: true},
        categoryName:{type: String, required: true},
        categoryDescription:{type:String, required: true},
        products: {
            productId:{type:String,required:true },
            productName:{type:String, required: true},
            productPrice:{type:String, required:true},
            productDescription:{type:String,required: true}
        }
    }
);

module.exports = mongoose.model('Category',schema);
