const express = require("express");
var mongoose = require("mongoose");
const {userProfiles} = require("../models/userProfile");
const {Package} = require("../models/package.model");
const path = require('path');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {gallery} = require("../models/gallery");
let router = express.Router();

const createProfile = async (req, res, next) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                console.log(err);
            }
            tokens = buffer.toString("hex");
            console.log(tokens);
            let user = await new userProfiles(req.body);
            user.resetToken = tokens;
            user.active = false;
            var randomstring = Math.random().toString(36).slice(-8);
            user.password = randomstring;
            if (!user) {
                console.log("user is not created");
            }
            let datatosent = {
                message: "user created",
                user,
            };
            await user.generateHashedPassword();
            await user.save();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: "beautypalmist@gmail.com", // generated ethereal user
                    pass: "yucshktuqvvvuprd", // generated ethereal password
                },
            });

            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: "beautypalmist@gmail.com",
                to: user.email, // list of receivers
                subject: `Confirm Your Email`, // Subject line

                html: `
    <p>You requested for Create Account</p>
    <h5>Your Email is ${req.body.email} and Password is ${randomstring} click in this <a href='http://localhost:4200/verify/${tokens}'>link</a> to active Your Account if you dont sent request to Create account then iqnore this message</h5>
    `,
            });
            return res.send(datatosent);
        });
    } catch (e) {

        console.log(e);
    }
};

const get = async (req, res, next) => {
    try {
        const id = req.params.id;
        let user = await userProfiles.findById(id);
        if (!user) {
            console.log("users not find")
        }
        let datatosent = {
            message: "user list",
            user,
        };
        return res.send(user);
        console.log(user);
    } catch (e) {
        console.log(e)
    }
};
const getPackageById = async (req, res, next) => {
    try {
        const id = req.params.id;
        let package = await Package.findById(id);
        if (!user) {
            console.log("Package not find")
        }
        let datatosent = {
            message: "package list",
            package,
        };
        return res.send(package);
        console.log(package);
    } catch (e) {
        console.log(e)
    }
};

const update = async (req, res, next) => {
    try {
        const id = req.body.id;
        console.log(req.body);
        let user = await userProfiles.findByIdAndUpdate(id, req.body);
        if (!user) {
        }

        return res.send(user);
    } catch (e) {

        console.log(e);
    }
};
const Profilelogin = async (req, res, next) => {
    try {
        // Extract email and password from request body
        const email = req.body.email;
        const password = req.body.password;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).send({error: "Email and password are required"});
        }

        // Find user with matching email and password
        const user = await userProfiles.findOne({email: email});
        console.log(user);
        if (!user) {
            return res.status(401).send({error: "Invalid email or password"});
        }
        console.log(user.active);
        if(user.active == false){
            return res.status(401).send({error:"You Account Disable Please Contact Admin."});
        }
        // Generate JWT token
        // const token = jwt.sign({ _id: user._id }, "jwtPrivateKey");

        // Update user's login status
        await userProfiles.findOneAndUpdate(

            {_id: user._id},

            {$set: {LoginStatus: true}}
        );

        // Return login success response with token and user ID
        return res.status(200).send({
            message: "Login Successful",
            // token: token,
            id: user._id,
            user: user,
        });
    } catch (error) {
        // Return error response if something goes wrong
        return res;
    }
};

const confirmEmail = async (req, res) => {
    try {
        console.log(req.body.token);
        const user = await userProfiles.findOne({
            resetToken: req.body.token,
        });

        if (!user)
            return res.status(422).json({error: "Try again session expired"});

        user.resetToken = "";
        user.active = true;
        await user.save();
        res.json({message: "Email Approved"});
    } catch (err) {
        console.log(err);
    }
};

const otpVerification = async (req, res) => {
    try {
        console.log(req.body.email);
        const user = await userProfiles.findOne({
            email: req.body.email,
        });

        if (!user)
            return res.status(422).json({error: "Try again session expired"});
        user.phoneactive = true;
        await user.save();
        res.json({message: "Phone Number Approved"});
    } catch (err) {
        console.log(err);
    }
};

const blockUser = async (req, res) => {
    const {userId, loginId} = req.body; // Extract the user ID from the request body
    const blockedUser = {blockedUserId: userId, UserId: loginId}; // Create an object with the user ID to be added to the "block" array

    // Find the user document and update the "block" array by pushing the blocked user object
    userProfiles.findByIdAndUpdate(
        loginId,
        {$push: {Block: userId}},
        {new: true},
        (err, user) => {
            if (err) {
                return res.status(500).send(err); // Return an error if there was a problem updating the document
            }
            return res.send(user); // Return the updated user document
        }
    );
};

const changeLoginStatus = async (req, res) => {
    const {userId, LoginStatus} = req.body; // Extract the user ID and block status from the request body

    // Find the user document and update the "BlockStatus" field
    userProfiles.findByIdAndUpdate(
        userId,
        {LoginStatus: LoginStatus},
        {new: true},
        (err, user) => {
            if (err) {
                return res.status(500).send(err); // Return an error if there was a problem updating the document
            }
            return res.send(user); // Return the updated user document
        }
    );
};

const showBlockedUsers = async (req, res) => {
    try {
        const userId = req.body.id;
        const user = await userProfiles.findById(userId);
        const blockedUsers = await userProfiles.find({_id: {$in: user.Block}});

        // Return the blocked user objects in the response
        res.status(200).json({data: blockedUsers});
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error,
        });
    }
};

const unblockUser = async (req, res) => {
    const userId = req.body.userId;
    const blockedUserId = req.body.blockedUserId;

    try {
        const user = await userProfiles.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    Block: blockedUserId,
                },
            },
            {
                new: true,
            }
        );

        return res.status(200).json({
            message: "User unblocked successfully",
            user: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error unblocking user",
            error: error,
        });
    }
};

const payment = async (req, res) => {
    // Get the payment amount from the request body
    const amount = req.body.amount;

    // Redirect to WhatsApp with the payment amount
    res.send(
        `https://api.whatsapp.com/send?phone=<YOUR_PHONE_NUMBER>&text=I%20would%20like%20to%20make%20a%20payment%20of%20${amount}}`
    );
    // res.redirect(`https://wa.me?text=I%20would%20like%20to%20make%20a%20payment%20of%20${amount}`);
};


const changeSingleImageStatus = async (req, res, next) => {
    try {
        const {id, private} = req.body;
        let gal = await gallery.findById(id);
        gal.private = private;
        await gal.save();

        let datatosent = {
            message: "statusChange",
            gal,
        };
        return res.send(datatosent);
    } catch (e) {
        return res.send(e);
    }
};
const changeAllSttaus = async (req, res, next) => {
    try {
        const {userId, private} = req.body;
        console.log(userId);
        let gal = await gallery.updateMany(
            {userId: userId},
            {private: private},
            {multi: true, upsert: true, new: true}
        );

        console.log(gal);
        let datatosent = {
            message: "statusChange",
            gal,
        };
        console.log(datatosent);
        return res.send(datatosent);
    } catch (e) {
        return res.send(e);
    }
};
const uploadProfileImage = async (req, res, next) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        let profile = await userProfiles.findById(userId);
        profile.image = req.file.path;
        await profile.save();
        let datatosent = {
            message: "image uploaded",
            profile,
        };
        return res.send(datatosent);
    } catch (e) {
        return res.send(e);
    }
};
const uploadAllImage = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const allfiles = req.body.image;
        console.log(userId);
        await gallery.findOneAndUpdate({userId: userId}, {$push: {image: allfiles}}, {new: true})
            .then(doc => {
                console.log(doc);
                if (!doc) {
                    res.status(404).json({message: "No document found with the specified criteria"});
                } else {
                    res.json(doc);
                }
            })
            .catch(error => {
                res.status(500).json({error: error.message});
            });

    } catch (error) {
        await res.status(500).json({error: error.message});
    }
};
const showAllImages = async (req, res, next) => {
    try {
        const userId = req.params.id;
        let gal = await gallery.find({userId: userId});
        await res.send(gal[0]);
    } catch (e) {
        return res.send(e);
    }
};
const lockGallery = async (req, res) => {
    const userId = req.body.userId;
    const status = req.body.status;
    console.log(userId, status);
    gallery.updateOne({ userId: userId }, { $set: { private: status } }, (err, doc) => {
        if (err) {
            // handle error
            res.status(500).json({ error: err });
        } else {
            // handle success
            res.json({ message: 'Document updated', updatedDocument: doc });
        }
    });
}
const deleteGallary = async (req, res, next) => {
    const id = req.params.id
    try {
      const gallary = await gallery.findByIdAndDelete({
        _id: id
      })
      res.status(200).json({
        message: "gallary has been deleted"
      })
    } catch (error) {
      res.status(500).json({
        error: err
      })
    }
};

const showPublicImages = async (req, res, next) => {
    try {
        const {userId} = req.body;
        let gal = await gallery.find({userId: userId, private: false});
        let datatosent = {
            message: "All Images",
            gal,
        };
        console.log(datatosent);
        return res.send(datatosent);
    } catch (e) {
        return res.send(e);
    }
};

const showOverallPublicImages = async (req, res, next) => {
    try {
        let gal = await gallery.find();
        let datatosent = {
            message: "All Images",
            gal,
        };
        console.log(datatosent);
        return res.send(datatosent);
    } catch (e) {
        return res.send(e);
    }
};
const addToPackage = async (req, res) => {
    const package = new Package();
    const body = req.body;
    console.log(body.image);

    // const img = req.file.filename;
    package.name = body.name;
    package.price = body.price;
    package.description = body.description;
    package.image = body.image;
    package.connect = body.connect;
    await package.save((err, doc) => {
        if (!err)
            res.json(doc);
        else {
            return next(err);
        }
    })
};
const getPackage = async (req, res) => {
    let package = await Package.find();
    return res.send(package)
};

const assignPackageToUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const uid = req.body.packageId._id;
        console.log(userId);
        let profile = await userProfiles.findById(userId);
        profile.package = uid;
        profile.connect = req.body.packageId.connect
        await profile.save();
        let datatosent = {
            message: "Assign Package",
            profile,
        };
        return res.send(datatosent);
    } catch (e) {
        return res.send(e);
    }
};
const getallUsers = async (req, res, next) => {
    try {
        let user = await userProfiles.find();
        if (!user) {
            console.log("users not find")
        }
        let datatosent = {
            message: "user list",
            user,
        };
        return res.send(user);
    } catch (e) {
        console.log(e)
    }
};
const userUpdate = async (req, res, next) => {
    console.log(req)
    const body = req.body;
    console.log(body);
    let userUpdate;
    userUpdate = {...body};
    await userProfiles.findByIdAndUpdate(req.params.id, userUpdate,
        (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                return next(err);
            }
        }).clone();
};
const deletePackage = async (req, res) => {
    const id = req.params.id
    try {
        const package = await Package.findByIdAndDelete({
            _id: id
        })
        res.status(200).json({
            message: "User has been deleted"
        })
    } catch (error) {
        res.status(500).json({
            error: err
        })
    }
};
const connectsDecrement = async (req, res) => {
    try {
        const userId = req.body._id;
        console.log(userId);
        let profile = await userProfiles.findById(userId);
        profile.connect = profile.connect - 4
        if (profile.connect < 4) {
            profile.package = "";
        }
        await profile.save();
        console.log(profile);
        let datatosent = {
            message: "decrement connect",
            profile,
        };
        return res.send(datatosent);
    } catch (e) {
        return res.send(e);
    }
    // try {
    //   const  userId = req.params.id;
    //   console.log(userId);
    //   const user = await userProfiles.findById(userId);
    //   let profile = await userProfiles.findOneAndUpdate(userId,{ $inc: { connect: -4 } } );
    //   console.log(profile)
    //   await profile.save();
    //   let datatosent = {
    //     message: "update connect",
    //     profile,
    //   };
    //   return res.send(datatosent);
    // } catch (e) {
    //   return res.send(e);
    // }
};
module.exports = {
    createProfile,
    otpVerification,
    update,
    get, getallUsers,
    showOverallPublicImages,
    showPublicImages,
    showAllImages,
    userUpdate,
    changeSingleImageStatus,
    uploadAllImage,
    Profilelogin,
    confirmEmail,
    blockUser,
    changeAllSttaus,
    changeLoginStatus,
    showBlockedUsers,
    unblockUser,
    payment,
    uploadProfileImage,
    addToPackage, getPackage, assignPackageToUser, deletePackage, getPackageById,
    connectsDecrement,
    deleteGallary,lockGallery
    // ,
};
