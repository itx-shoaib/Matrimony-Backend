const mongoose = require("mongoose");
require("./userProfile");
require("./userRequest");

const PackageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number },
    description: { type: String },
    image:{ type:Buffer },
    connect:{type:Number},
});
var Package = mongoose.model('Package', PackageSchema);
module.exports.Package = Package;