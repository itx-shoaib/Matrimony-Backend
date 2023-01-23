const express = require("express");
const router = express.Router();
const { subAdmin } = require("../models/subAdmin");
const Module = require("module");

const subAdminCreate = async (req,res)=>{
    console.log(req.body);

    try{
        subAdmin.name = req.body.name;
        subAdmin.userName = req.body.userName;
        subAdmin.password = req.body.password;
        subAdmin.edit = req.body.edit;
        subAdmin.view = req.body.view;
        await subAdmin.save((doc,err)=>{
            if(!err){
                res.json(doc);
            }else{
                return next(err);
            }
        })
    }catch (error){

    }
};
const subAdminShow = async  (req,res)=>{
    try{

    }catch (error){

    }
};
const subAdminUpdate = async  (req,res)=>{
    try{

    }catch (error){

    }
};
module.exports = {
    subAdminCreate,
    subAdminShow,
    subAdminUpdate,
}
