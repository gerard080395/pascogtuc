/**
 * Created by Gerard on 1/18/2017.
 */
var mongoose = require('mongoose');
var User = require('../models/user');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true},
    time : { type : Date, default: Date.now }

});

module.exports = mongoose.model('Order', orderSchema);