const router =require("express").Router();
const User =require("../models/usermodel")
const bcrypt=require("bcrypt")


//REGISTER
router.post("/register",async (req,res)=>{
    
    try{
        //encrypt the password
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(req.body.password,salt)
        //create a user
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedpassword,
        })
        //save the user
        const user=await newUser.save();
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

//LOGIN
router.post("/login",async(req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email});
        !user && res.status(404).json("user not found")

        const validpassword= await bcrypt.compare(req.body.password,user.password)
        !validpassword && res.status(400).json("invalid password")

        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports=router