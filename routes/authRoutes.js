const express = require("express");
const router = express.Router();
const { UserSchema } = require('../models')


router.get('/login/:email', async(req , res)=>{
    const user = await UserSchema.findOne({email: req.params.email});
    if(user){
      return res.json(user)
    }
    res.json({error:"User not found"})
  })

  router.get("/createUser/:email", async(req,res)=>{
    
    const userExist = await UserSchema.findOne({email: req.params.email});

    if(userExist){
      return res.send("Email already exist")
    }
    
    const user = await new UserSchema({email: req.params.email}).save();
    if(user){
     return  res.send("Registration successful")
    }
    return res.send("An error occured!")
  })

module.exports = router;