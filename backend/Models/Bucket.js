const mongoose = require("mongoose");

const BucketSchema = mongoose.Schema({
  Name: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Buckets", BucketSchema);
