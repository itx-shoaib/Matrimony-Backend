var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var userProfileSchema = mongoose.Schema({
    email: String,
    personalContact: String,
    parentContact: String,
    socialLinkFb: String,
    socialLinkInsta: String,
    socialLinkTwitter: String,
    name: String,
    profileCreated: String,
    gender: String,
    age: Number,
    status: String,
    religious: String,


    sect: String,
    caste: String,
    resetToken: String,
    active: Boolean,
    password: String,
    religiousStatus: String,
    clan: String,
    montherTonque: String,
    looks: String,
    complexion: String,
    height: String,
    build: String,
    hobbies: String,



    country: String,
    province: String,
    city: String,
    house: String,
    nationality: String,
    futurePlans: String,
    professional: String,
    jobStatus: String,
    workplace: String,
    qualification: String,
    institution: String,
    income: String,


    professionalInfo: String,
    fatherOccuption: String,
    motherOccuption: String,
    siblingsCountSisters: Number,
    siblingsCountBrothers: Number,
    socialEconomic: String,
    familyInfo: String,
});
userProfileSchema.methods.generateHashedPassword = async function () {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
};
userProfileSchema.methods.isValidPassword = async function (password) {
    const user = this;

    const compare = await bcrypt.compare(password, user.password);

    return compare;
};
var userProfile = mongoose.model("userProfile", userProfileSchema);
module.exports.userProfiles = userProfile;
//for sign up
// module.exports.validateUserLogin = validateUserLogin; // for login
