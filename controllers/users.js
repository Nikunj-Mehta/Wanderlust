const User = require("../models/user.js");
const Listing = require("../models/listing.js")

// Renders signup up form
module.exports.renderSignupFrom = (req, res) => {
  res.render("users/signup.ejs");
};

// Takes user info from the signup form, creates a new User object, registers the user in the database, and logs them in automatically. If an error occurs (like a duplicate username), it flashes an error message and redirects back to the signup page.
module.exports.signup = async (req,res) => {
  try{
    let { username, email, password } = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password); // User.register automatically enforces a unique username. If the username already exists, it will throw an error: "A user with the given username is already registered."
    console.log(registeredUser);

    // Method to login after signup without this method we need to login explicitly after signup. It takes 2 params one is user and other is callback.
    req.login(registeredUser, (err) => { // if any error occured then it will be stored in err.
      if(err) {
        return next(err); // this will call error middleware 
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    }); // when login operation completed, user will be assigned to req.user. other req.user is undefined.
 
  } catch(err) {
    req.flash("error", err.message);
    res.redirect("/signup"); // we used try catch to avoid going to random page and stay on sign-Up page if any error occured
  }
};

// If the user already exists, they will be asked for username and password on the login page.
module.exports.renderLoginFrom = (req, res) => {
  res.render("users/login.ejs");
};

// After login which is done by passport display a flash msg and redirect to the requested url if any else redirect to listings.
module.exports.login = async (req, res) => { 
  req.flash("success", "Welcome back to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings"; // res.locals.redirectUrl ? res.locals.redirectUrl : "/listings"; If res.locals.redirectUrl exists than take it else take /listings.
  res.redirect(redirectUrl);
};

// Logout user
module.exports.logout = (req, res, next) => {
  req.logout((err) => { // if any error occured then it will be stored in err. It takes callback as an argument. It will remove the req.user and will make it undefined again.
    if(err) {
      return next(err); // this will call error middleware 
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

// User's profile
module.exports.getProfile = async (req, res, next) => {
  const { id } = req.params; // Extract the user's ID from URL

  const user = await User.findById(id); // Find the user with that id in UserDB and store it in user var.
  if (!user) { // No no user found then with an error flash redirect to /listings.
    req.flash("error", "User not found!");
    return res.redirect("/listings");
  }
  
  // include title, image, and price
  const listings = await Listing.find({ owner: id })
    .select("title image price");

  res.render("users/profile", { profile: user, listings });
};