const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/formProject")
  .then(() => console.log("db connection successfull"))
  .catch((err) => console.log("db error: ", err));
