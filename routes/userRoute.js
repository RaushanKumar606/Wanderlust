const express = require("express");
const route = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirect } = require("../meddleware.js");


//SingUp Router 
route.get("/singUp",(req,res)=>{
    res.render(`users/userForm.ejs`)
})
route.post("/singUp", wrapAsync(async(req,res)=>{
   try{
    let {username,email,password} = req.body;
    let newUser = new User({email,username})
    let registeredUser = await User.register(newUser,password);
    console.log("registeredUser")
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/singUp");
   }
   catch(e){
    req.flash("error",e.message);
    res.redirect("/singUp");
   }
}));

//Login Router 
route.get("/login",(req,res,next)=>{
    res.render(`users/login.ejs`)
});

route.post("/login", saveRedirect, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,}),
 async(req,res)=>{
    req.flash("success", "Welcome to Login");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

//user logout 
route.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
})


module.exports = route

