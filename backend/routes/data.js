const router = require("express").Router();

const Data = require("../models/Basic");
const { isAuthenticated } = require("../helpers/auth");

router.get("/data/add", isAuthenticated, (req, res) => {
  res.render("data/new-data");
});

router.post("/data/new-Data", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Please Write a title" });
  }
  if (!description) {
    errors.push({ text: "Please Write a description" });
  }
  if (errors.length > 0) {
    res.render("data/new-data", {
      errors,
      title,
      description,
    });
  } else {
    const newData = new Data({ title, description });
    newData.user = req.user._id;
    await newData.save();
    req.flash("success_msg", "Data Added Successfully");
    res.redirect("/data");
  }
});

router.get("/data", isAuthenticated, async (req, res) => {
  const data = await Data.find({ user: req.user._id })
    .sort({ date: "desc" })
    .lean();
  res.render("data/all-data", { Data });
});

router.get("/data/edit/:id", isAuthenticated, async (req, res) => {
  const Data = await Data.findById(req.params.id).lean();
  res.render("data/edit", { Data });
});

router.put("/data/edit/:id", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Data.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Data Updated Successfully");
  res.redirect("/data");
});

router.delete("/data/delete/:id", isAuthenticated, async (req, res) => {
  await Data.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Data Deleted Successfully");
  res.redirect("/data");
});

module.exports = router;
