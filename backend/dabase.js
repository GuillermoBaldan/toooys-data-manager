const mongoose = require("mongoose");

(async () => {
  try {
    const db = await mongoose.connect("mongodb://localhost/toooys-data");
    console.log("DB is connected");
  } catch (error) {
    console.error(error);
  }
})();
