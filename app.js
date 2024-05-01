const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const Campground = require("./models/Campground");
const methodOverride = require("method-override");

const db = mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

db.then(() => {
  console.log("Database, connection open. ");
}).catch((e) => {
  console.log(e);
  console.log("Error in Database Connection");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.listen(3000, () => {
  console.log("listening at 3000");
});

app.get("/campground", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds: campgrounds });
});

app.get("/campground/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campground", async (req, res) => {
  const camp = new Campground(req.body.campground);
  await camp.save();
  res.redirect(`/campground/${camp._id}`);
});

app.get("/campground/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

app.get("/campground/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campground/:id", async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campground/${camp._id}`);
});

app.delete("/campground/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campground");
});
