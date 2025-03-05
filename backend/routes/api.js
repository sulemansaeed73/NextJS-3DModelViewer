const express = require("express");
const multer = require("multer");
const AutoCadController = require("../Controllers/AutoCadController");
const UserController = require("../Controllers/UserController");
const router = express.Router();



const autocadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Storage/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const autocadfile = multer({
  storage: autocadStorage,
});


router.post("/login", UserController.Login);
router.get("/checklogin", UserController.CheckLogin);
router.get("/user_logout", UserController.UserLogout);
router.post("/check-email", UserController.CheckEmail);
router.post("/signup", UserController.Signup);

router.get("/auth", AutoCadController.Auth);
router.post("/check-create-bucket", AutoCadController.checkAndCreateBucket);
router.post(
  "/upload_file",
  autocadfile.single("file"),
  AutoCadController.UploadAutoCad
);

router.post("/translatefile", AutoCadController.Translate);
// router.get("/checker", AutoCadController.checker);


module.exports = router;
