if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // to use mongo-store for sessions storage on cloud for deployment of our project.
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local"); // to authenticate using username and password.
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const Listing = require("./models/listing.js")


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // for static files css, js common for all webpages.

const store = MongoStore.create({ // Method used to create new mongo store.
  mongoUrl: dbUrl, // info iss url pr store hogi jo mongo AtlasDB ki link hai, if we want to store data on our local DB then give MONGO_URL.
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 3600 * 24 // Interval between session updates. If there is no change in session the when we will update our infomation. Interval is passed in seconds 24 hours.
});

store.on("error", (err) => {
  console.log("Error in MONGON SESSION STORE", err);
});

const sessionOptions = {
  store, // Now our session related info will be stored in Atlas DB.
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000, // Date.now() returns exact time in milliseconds. the user's data will be stored as cookie for 7 days.
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // to prevent cross scripting attacks.
  },
};

// Root route
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions)); // use passport after session as passport uses session. We will not ask user to login if he/she opens same link using diff tab but in same browser.
app.use(flash()); // always use before routes.

app.use(passport.initialize()); // Jb bhi koi req aye hum initialize kr de passport ko as a middleware.
app.use(passport.session()); // our web application needs the ability to identify users as they browse from page to page.
passport.use(new LocalStrategy(User.authenticate())); // User must be authenticated using local-stratergy provided by passport package.
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); // serialize = to store all the user related info in session.
passport.deserializeUser(User.deserializeUser()); // deserialize = to unstore (remove) all the user related info from the session.


app.use((req, res, next) => { // middleware
  res.locals.success = req.flash("success"); // res.locals method ka kaam hai ki vo ejs tempate m variable pass krta hai success naam se aur uss naam se he hum access kr sakte hai aur usme value rhegi "success" key ka msg
  // console.log(res.locals.success); // gives an array. If nothing done then empty array.
  res.locals.error = req.flash("error"); // similarly error naam ka var rhega aur usme value "error" key ka jo msg hai vo rhegi.

  res.locals.currUser = req.user; // to pass req.user in navbar.ejs (To display only login and signup if user is not logged in or req.user = undefined and logout if user exists that is req.user = some object).
  next();
});

// app.get("/demouser", async(req, res) => {
//   let fakeUser = new User({ // create a new user
//     email: "student@gmail.com", // in schema we only defined email
//     username: "delta-student" // but we can add username too, becz passport-local-mongoose adds username field itself.
//   });
//   // register the new user
//   let registeredUser = await User.register(fakeUser, "helloworld"); // .register is a static method takes 2 arguments, 1 is user and 2nd is password. It stored the user along with passowrd in our db. and also checks if the username is unique or not.
//   res.send(registeredUser);
// });

app.get("/", async (req, res) => {
  let allListings = await Listing.find({}); // storing all data present in collection named "listings" in a var named "allListings".
  res.render("listings/index.ejs", { allListings });
});

app.use("/listings", listingRouter); // instead of listing we are using a single line.
app.use("/listings/:id/reviews", reviewRouter); // return here is parent route "/listing/:id/reviews"
app.use("/", userRouter)

// Catch-all route for 404 errors
app.all("*", (req, res, next) => { // If the request is not accepted by any of the above then the req will be accepted here and the response will be sent form here.
  const err = new ExpressError(404, "Page Not Found!"); // to make this work download "express": "^4.18.2", current was 5.0.1 which is unstable.
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  let {statusCode = 500, message="Something went wrong"} = err; // if some message is there the that message will be displayed else "something went wrong" is default value so that message is not empty.
  res.status(statusCode).render("error.ejs", { message }); // wrapAsync ka jo catch(next) hai vo yaha pr le ayegea.
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is listening to port: 8080");
});