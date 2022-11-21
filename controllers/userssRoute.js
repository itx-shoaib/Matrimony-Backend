const express = require("express");
const router = express.Router();
// const Booking = require('../models/booking');
// const Room = require('../models/room');

// Router for getting all online users
const OnlineUser = async (req, res) => {
    const { Gender } = req.body
    try {
        if (Gender === "Male") {
            // const user = await Booking.find({"online":"true"},{"GenderSelectedFor":"Female"})
            res.send("Female")
        }
        else {
            // const user = await Booking.find({"online":"true"},{"GenderSelectedFor":"Male"})
            res.send("Male")
        }

    } catch (error) {
        return res.status(400).json({ error })
    }
}




module.exports = {
    OnlineUser
};