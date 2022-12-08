const express = require("express");
const router = express.Router();
const { userProfiles } = require("../models/userProfile");

// Router for getting all  users
const AllUser = async (req, res) => {
    try {
        const user = await userProfiles.find();
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}

const DeleteUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userProfiles.findByIdAndDelete({
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
}

const BlockUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await userProfiles.findById({
            _id: id
        })
        user.BlockStatus = true
        await user.save();
        res.status(200).json({
            message: "User has been blocked successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        })
    }
}



module.exports = {
    AllUser,
    DeleteUser,
    BlockUser
};