const router = require("express").Router();

const Data = require("../models/Basic");
const { isAuthenticated } = require("../helpers/auth");

router.get("/data/add", isAuthenticated, (req, res) => {
    console.log("se hace render de data/new-data desde GET")
  res.render("data/new-data");
});

router.post("/data/new-single-data", isAuthenticated, async (req, res) => {
  //const { title, description } = req.body;
  const { semanticValue } = req.body
  const errors = [];
  
  if (!semanticValue) {
    errors.push({ text: "Please write a semantic value" });
    console.log("Se hace errors.push")
  }
  /*
  if (!description) {
    errors.push({ text: "Please Write a description" });
  }*/
  if (errors.length > 0) {
    console.log("se hace render de data/new-data desde POST")
    console.log(`errors.length: ${errors.length}`)
    res.render("data/new-data", {
      errors,
      semanticValue,
    });
  } else {
    const newData = new Data({ semanticValue });
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
  res.render("data/all-data", { data });
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
