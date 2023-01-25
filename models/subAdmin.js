var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var subAdminSchema = mongoose.Schema({
    name:String,
    password:String,
    userName:String,
    edit: {type:Boolean,default: false},
    view: {type:Boolean,default:true},
    status: {type:Boolean,default:false,}
});

var subAdmin = mongoose.model("subAdmin", subAdminSchema);
module.exports.subAdmin = subAdmin;
//for sign up
// module.exports.validateUserLogin = validateUserLogin; // for login
