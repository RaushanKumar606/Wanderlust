
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const  engine = require('ejs-mate');
const  ExpressError  = require("./utils/ExpressError.js");
const session = require('express-session');
const flash = require("connect-flash");
const User = require("./models/user.js")
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const dotenv =require("dotenv").config();



const listing = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const userRoute = require("./routes/userRoute.js");

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname ,"/public")))




const MONGO_URL ='mongodb://127.0.0.1:27017/TestDb';
async function main() {
    try {
        await mongoose.connect(MONGO_URL );    
        console.log('Connection successful to DataBase thank you mongodb');        } catch (err) {
        console.error('Connection error:', err);
    }}
main();

const sessionOption =
    {
    secret: "mysecretcode"
    ,resave:false,
    saveUninitialized:true,
    cookie :{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
    }
};
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

  app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
     })
 
app.use("/listings",listing);
app.use("/listings/:id/review",reviews);
app.use("/",userRoute)





// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, " Page Not Found!"));  // Changed to "Page Not Found!"
});

// Error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    if (!res.headersSent) {
        res.status(statusCode).render("error.ejs",{message});
    } else {
        next(err); // Ensure any further errors are handled by Express if headers are already sent
    }
});

app.listen(8000, () => {
    console.log("Server is working on port 8000");
});
