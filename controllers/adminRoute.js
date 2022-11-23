const express = require("express");
const router = express.Router();
const { userProfiles } = require("../models/userProfile");

// Router for getting all  users
const AllUser = async (req, res) => {
    try {
        const user = await userProfiles.find();
        res.status(200).json({ data: user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}




module.exports = {
    AllUser
};