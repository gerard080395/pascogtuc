/**
 * Created by Gerard on 6/8/2017.
 */
var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var schema = new Schema({
    paperPdfPath:{type:String,required:true},
    paperFacultyName:{type:String,required:true},
    paperLevel:{type:String,required:true},
    paperMidSem:{type:String,required:true},
    paperEndSem:{type:String,required:true},
    paperResit:{type:String,required:true},
    paperLecturerName:{type:String,required:true},
    paperCourseCode:{type:String,required:true},
    paperCourseTitle:{type:String,required:true},
    paperYear:{type:String,required:true},
    paperMonth:{type:String,required:true},
    paperDescription:{type:String, required:true}

});

module.exports = mongoose.model('Paper',schema);
