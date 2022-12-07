const express = require("express");
const { userProfiles } = require("../models/userProfile");
const { userRequest } = require("../models/userRequest");
const router = express.Router();
// const Booking = require('../models/booking');
// const Room = require('../models/room');

// Router for getting all online users
const OnlineUser = async (req, res) => {
  const { Gender } = req.body;
  try {
    if (Gender === "Male") {
      const user = await userProfile.find({ gender: "female" });
      return res.status(200).send(user);
    } else {
      const user = await userProfile.find({ gender: "male" });
      return res.status(200).send(user);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const addToFav = async (req, res) => {
  const { uid, id } = req.body;
  try {
    const user = await userProfiles.findById(id);
    const check = user.favourites.some((val) => val == uid);
    if (check) {
      user.favourites = user.favourites.filter((val) => val != uid);
      await user.save();
    } else {
      user.favourites.push(uid);
      await user.save();
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const sentRequest = async (req, res) => {
  const { id, rid, request } = req.body;
  try {
    if (request == "sending") {
      let user = await new userRequest({
        rid: rid,
        sid: id,
        requests: "pending",
      });
      user.save();
    } else if (request == "cancel") {
      let user = userRequest.findOneAndUpdate(
        { sid: id, rid: rid },
        { requests: "cancel" }
      );
    } else if (request == "accept") {
      let user = userRequest.findOneAndUpdate(
        { sid: id, rid: rid },
        { requests: "accept" }
      );
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const viewRequest = async (req, res) => {
  const { uid, id, rid } = req.body;
  try {
    let user = await userRequest.findOne({
      rid: rid,
      sid: id,
    });

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const viewFav = async (req, res) => {
  const { id } = req.body;
  try {
    let user = await userProfiles.findById(id);
    const ids = user.favourites;
    let users = await userProfiles.find({ _id: { $in: ids } });
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
const findMatch = async (req, res) => {
    const { id } = req.body;
    try {
      let user = await userProfiles.findById(id);
      let allUser = await userProfiles.findById();
      return res.status(200).send(users);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };
module.exports = {
  OnlineUser,
  addToFav,
  sentRequest,
  viewRequest,
  viewFav,
};
