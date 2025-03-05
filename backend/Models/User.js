const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  country: { type: String },
  profile: { type: String, default: "http://localhost:5000/Storage/defaultprofile/default.jpg" },
  gender: { type: String },
});

module.exports = mongoose.model("user", UserSchema);
