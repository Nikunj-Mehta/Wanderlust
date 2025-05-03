const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [ // listing k andr reviews ki id show hogi. Iss array m review push hoga phir review db m review save hoga aur phir listing save hogi db m jisme uska review array m added review rhega.
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: { // if you need to make any changes then first comment this part cause it is not filled in data.js and we are not doing cause it might exceed our limit of MapBox
    type: {
      type: String, // Don't do '{location: {type: String}}'
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: { // added a category field.
    type: String,
    enum:["Trending", "Rooms", "Iconic city", "Mountains", "Castle", "Camping", "Farms", "Arctic", "Beach", "Boats"],
    required: true,
  },
});

// Mongoose middleware if we run findOneAndDelete on listing then after doing it's work and before returning control it will execute the code below, which is, if a listing gets deleted then all the reviews related to that listing also deletes.
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}}); // agar koi listing delete huye to uske andr reviews collection m se vo db docs delete ho jynge jinki id uss listings doc m review[] m the.
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;