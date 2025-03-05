const User = require("../Models/User");
const jwt = require("jsonwebtoken");

module.exports = {
  async Login(req, res) {
    const { email, password, rememberMe } = req.body;
    const emailRegex = /^(?:[a-zA-Z0-9]+@(gmail\.com|proton\.me))$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json("Invalid Email Syntax");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("No User Found");
    }

    if (user.email === email && user.password !== password) {
      return res.status(401).json("Incorrect Password");
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    if (
      user.email === email &&
      user.password === password &&
      rememberMe === true
    ) {
      res.cookie("user", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1209600000, // 2 weeks in milliseconds
      });

      return res.status(200).json(user);
    }

    if (
      user.email === email &&
      user.password === password &&
      rememberMe === false
    ) {
      res.cookie("user", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 259200000, // 3 days in milliseconds
      });

      return res.status(200).json(user);
    }
  },

  async Signup(req, res) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }
    try {
      const user = new User(req.body);
      const emailRegex = /^(?:[a-zA-Z0-9]+@(gmail\.com|proton\.me))$/;
      if (user.email && !emailRegex.test(user.email)) {
        return res.status(400).json("Invalid Email Syntax");
      }

      if (user && !same_email) {
        const result = await user.save();
        return res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        res.status(400).json({ message: "Email is already taken" });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  },

  async CheckLogin(req, res) {
    const token = req.cookies.user;
    if (token) {
      return res.status(200).json("Logged IN");
    } 
  },

  async CheckEmail(req, res) {
    console.log("Start");
    const email = req.body;
    const emailstatus = await User.findOne(email);
    console.log(email);

    if (emailstatus) {
      return res.status(409).json("Email Already Exists");
    } else {
      return res.status(201).json("Email Done");
    }
  },

  async UserLogout(req, res) {
    res.clearCookie("user", {
      httpOnly: true,
    });
    return res.status(200).json({ message: "Logged out successfully" });
  },
};
