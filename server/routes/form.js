const express = require("express");
const formidable = require("formidable");
const fs = require("fs");

const User = require("../model/form");
const router = express.Router();

//Create Form
const createForm = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (!fields.name || !fields.email || !fields.number || !file.photo) {
      return res.status(400).json({ error: "Fill all the fields" });
    }

    const user = new User(fields);
    if (file.photo) {
      if (file.photo.size > 100000) {
        return res.status(400).json({ error: "file size is too big" });
      }
      user.photo.data = fs.readFileSync(file.photo.filepath);
      user.photo.contentType = file.photo.mimetype;

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
      });
      res.json({ user });
    }
  });
};
const updateForm = (req, res) => {
  let id = req.params.userId;
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    User.findByIdAndUpdate(
      id,
      { $set: { ...fields } },
      { new: true },
      (err, user) => {
        if (err) {
          return res.status(400).json({ error: "Invalid entry or user not found" });
        }
        if (file.photo) {
          if (file.photo.size > 100000) {
            return res.status(400).json({ error: "file size is too big" });
          }
          user.photo.data = fs.readFileSync(file.photo.filepath);
          user.photo.contentType = file.photo.mimetype;

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({ error: err });
            }
          });
          res.json({ user });
        }
      }
    );
  });
};

const userPhoto = (req, res) => {
  let id = req.params.userId;
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({ error: "user not found" });
    } else {
      if (user.photo.data) {
        res.set("Content-Type", user.photo.contentType);
        return res.send(user.photo.data);
      }
    }
  });
};

//getForm
const getForm = (req, res) => {
  User.find((err, data) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json(data);
  });
};

const deleteForm = async (req, res) => {
  const id = req.params.userId;
  const del = await User.findByIdAndDelete(id);
  res.json(del);
};

router.post("/create", createForm);
router.get("/get", getForm);
//for photo
router.get("/photo/:userId", userPhoto);
router.put("/edit/:userId", updateForm);
router.delete("/delete/:userId", deleteForm);

module.exports = router;
