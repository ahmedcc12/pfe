const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken })
    .populate("group")
    .exec();

  if (!foundUser) return res.sendStatus(403); //Forbidden
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.matricule !== decoded.matricule)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          matricule: decoded.matricule,
          role: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

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
      downloadURL: foundUser?.avatarUrl.downloadURL,
    };

    res.json({ accessToken, user });
  });
};

module.exports = { handleRefreshToken };
