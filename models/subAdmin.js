var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var subAdminSchema = mongoose.Schema({
    name:String,
    password:String,
    userName:String,
    edit: {type:Boolean,default: false},
    view: {type:Boolean,default:false},
    active: {type:Boolean,default:true,}
});

var subAdmin = mongoose.model("subAdmin", subAdminSchema);
module.exports.subAdmins = subAdmin;
//for sign up
// module.exports.validateUserLogin = validateUserLogin; // for login
