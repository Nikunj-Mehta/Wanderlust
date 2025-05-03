const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Its job is to render all the listings.
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({}); // storing all data present in collection named "listings" in a var named "allListings".
  res.render("listings/index.ejs", { allListings });
};

// Its work is to extract search query form req.query if noting searched display allListings, else find the listings matching with search keyword and display all those listings.
module.exports.searchedListings = async (req, res) => {
  const { search } = req.query; // To extract the searched part.
  if(!search) {
    req.flash("error", "Please enter something to search for.");
    return res.redirect("/listings");
  }

  const searchedListings = await Listing.find({title: {$regex: search, $options: "i"}}); // case-insensitive search

  if (searchedListings.length === 0) {
    req.flash("error", "No listings found matching your search. However, here are all the available listings."); // if no listings matched the current search.
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListings: searchedListings }); // reused the listing.ejs to show filtered listings.
};

// Take category from req.params then in filtered listings search the listings array for category in db and then render index with filteredListings.
module.exports.filteredListings = async(req, res) => {
  const { category } = req.params; // Taking category filed out ie if req is sent to listings/category/Trending then Trending will be saved in category variable.
  const filteredListings = await Listing.find({ category });
  
  if(filteredListings.length == 0) {
    req.flash("error", "No listed locations for this category, Here are all the other available options.");
    return res.redirect("/listings");
  }
  
  res.render("listings/index.ejs", { allListings: filteredListings });
}

// If the user wants to add a new listing, it will render a form asking for the required listing information.
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// After receiving data from the new listing form, save it to the database and re-render the listings page with the new listing included.
module.exports.createListing = async (req, res, next) => { // importing and using wrapAsync. we need isLoggedIn here because if someone sends post req from hoppscotch.
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()
  
  let url = req.file.path; // Now we need to save these 2 things in our db.
  let filename = req.file.filename;
  console.log(url, " ... ", filename);
  const newListing = new Listing(req.body.listing); // saving all the listings info taken in array here.
  console.log(req.user); // Passport object stores all the current user related info in our req object and we can verify that here.
  newListing.owner = req.user._id; // to add owner who is logged in on our website as the owner of the new listing.
  newListing.image = {url, filename};

  newListing.geometry = response.body.features[0].geometry; // this will give us coordinates.
  
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Lisiting Created!");
  res.redirect("/listings");
};

// Takes the ID of the clicked listing(as all listings are enclosed in anchor tag <a> clicking anywhere on card will redirect to listings/:id), finds it from the database, and displays it.
module.exports.showListing = async (req,res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate({
    path: "reviews",
     populate: { // nested populate.
      path: "author", // for every review we need its author's details too. 
     },
    }).populate("owner"); // .populate("reviews") to get all the detail ie entire object in review doc. all to get all info about owner instead of just getting their objectId.
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// Takes the ID of the clicked listing(where the edit button is), renders the edit form if the listing exists; otherwise, displays an error message and redirects to /listings.
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); // to change properties of image edit url.
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Takes the data from the edit form, updates it in the database, and re-renders the listing with the changes.
module.exports.updateListing = async(req, res) => { // passing server side schema validator as middleware.
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); // deconstruct and fill the fields by updated values. These values will update all except image for that we need to do it again below.

  if(typeof req.file !== "undefined") { // If user didn't gave any image,  he just updated title or description then this will be undefined. We need to update image only if user gives a new image.
    let url = req.file.path; // Now we need to save these 2 things in our db.
    let filename = req.file.filename;
    listing.image = { url, filename }; // then update the image field of listing. first upload the file on cloud take it's url and filename then,
    await listing.save(); // save it in db.
  }
  req.flash("success", "Lisiting Updated!");
  res.redirect(`/listings/${id}`);
};

// Takes the ID of the clicked listing (where the delete button is), finds it in the database, and deletes it.
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Lisiting Deleted!");
  res.redirect("/listings");
};

