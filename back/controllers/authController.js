const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailerConfig = require("../config/mailerConfig");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { email, pwd, recaptchaToken } = req.body;

  if (!recaptchaToken)
    return res.status(400).json({ message: "Validate recaptcha" });

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
  const response = await fetch(url, { method: "POST" });
  const recaptcha = await response.json();
  if (!recaptcha.success)
    return res.status(400).json({ message: "Recaptcha failed" });

  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "email and password are required." });

  const foundUser = await User.findOne({ email: email })
    .populate("group")
    .exec();
  if (!foundUser) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (!match)
    return res.status(401).json({ message: "Invalid email or password" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        matricule: foundUser.matricule,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" }
  );
  const refreshToken = jwt.sign(
    { matricule: foundUser.matricule },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  foundUser.refreshToken = refreshToken;
  await foundUser.save();

  // Creates Secure Cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  const user = {
    userId: foundUser._id,
    matricule: foundUser.matricule,
    email: foundUser.email,
    firstname: foundUser.firstname,
    lastname: foundUser.lastname,
    department: foundUser.department,
    role: foundUser.role,
    groupname: foundUser.group.name,
    groupId: foundUser.group._id,
    downloadURL: foundUser.avatarUrl.downloadURL,
  };

  res.json({ accessToken, user });

  console.log("User logged in");
};

module.exports = { handleLogin };
