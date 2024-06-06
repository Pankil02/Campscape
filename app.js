const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const campgrounds = require("./routes/campground.js");
const reviews = require("./routes/review.js");

const db = mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
db.then(() => {
  console.log("Database, connection open. ");
}).catch((e) => {
  console.log(e);
  console.log("Error in Database Connection");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("listening at 3000");
});

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use("/campground", campgrounds);
app.use("/campground/:id/reviews", reviews);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "something went wrong....", statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong....";
  res.status(statusCode).render("error", { err });
});
