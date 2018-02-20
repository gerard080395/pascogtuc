/**
 * Created by Gerard on 1/24/2017.
 */
var mpower = require('mpower');

 var setup = new mpower.Setup({
 masterKey: '2594a25a-19de-4810-a9d5-e8d7e4f1222b',
 privateKey: 'test_private_9sL9BInb5NIksv1Pn4Zpt4pyf5Q',
 publicKey: 'test_public_BxgJcyoNGQ66xcySrVcuEGMuaSY',
 token: '03f5e7f68df16807c66c',
 mode: 'test' // optional. use in sandbox mode.
 });

 var store = new mpower.Store({
 name: 'Awesome Store', // only name is required
 tagline: 'Easy shopping',
 phoneNumber: '0261234567',
 postalAddress: 'P.0. Box MP555, Accra',
 logoURL: 'http://www.awesomestore.com.gh/logo.png'
 });

