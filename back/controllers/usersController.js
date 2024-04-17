const User = require("../model/User");
const Group = require("../model/Group");
const { uploadFile, deleteFile } = require("../middleware/file");

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";
  const searchOption = req.query.searchOption || "all";
  const order = req.query.order || "asc";
  const orderBy = req.query.orderBy || "matricule";

  try {
    let query = {};

    if (search !== "") {
      if (searchOption === "group") {
        const groupQuery = await Group.findOne({
          name: { $regex: search, $options: "i" },
        }).exec();
        if (groupQuery) {
          query.group = groupQuery._id;
        } else {
          return res.status(204).json({ message: "No users found" });
        }
      } else {
        if (searchOption === "all") {
          query = {
            $or: [
              { matricule: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { firstname: { $regex: search, $options: "i" } },
              { lastname: { $regex: search, $options: "i" } },
              { department: { $regex: search, $options: "i" } },
              { role: { $regex: search, $options: "i" } },
            ],
          };
        } else {
          query[searchOption] = { $regex: search, $options: "i" };
        }
      }
    }

    const options = {
      page,
      limit,
      populate: "group",
      sort: {
        [orderBy]: order,
      },
    };

    const users = await User.paginate(query, options);

    if (!users || users.docs.length === 0) {
      return res.status(204).json({ message: "No users found" });
    }

    res.json({
      users: users.docs,
      currentPage: users.page,
      totalPages: users.totalPages,
      totalCount: users.totalDocs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id).exec();
    if (!deleteUser) {
      return res
        .status(404)
        .json({ message: `User with ID ${req.params.id} not found` });
    }
    res
      .status(200)
      .json({ success: `User ${deleteUser.matricule} was deleted!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  try {
    const user = await User.findById(req.params.id).populate("group").exec();
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateUser = async (req, res) => {
  if (!req.params?.id)
    return res.status(400).json({ message: "User ID required" });

  const { matricule, email, firstname, lastname, department, role, group } =
    req.body;

  const file = req.file;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        matricule,
        email,
        firstname,
        lastname,
        department,
        role,
        group,
      },
      { new: true }
    ).exec();

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${req.params.id} not found` });
    }

    if (file) {
      if (user.photoURL?.path) {
        const filePath = user.photoURL.path;
        await deleteFile(filePath);
      }
      const data = await uploadFile(file, "avatars");
      if (data?.status === 500) {
        return res.status(500).json({ message: "Internal server error" });
      }
      const { path, downloadURL } = data;

      user.avatarUrl = {
        path: path,
        downloadURL: downloadURL,
      };
      await user.save();
    }

    res.json(user);
  } catch (err) {
    let message;
    if (err) {
      if (err.name === "ValidationError") {
        console.error(Object.values(err.errors).map((val) => val.message));
      }
      if (err.code === 11000) {
        console.error("Duplicate key error");
        message = Object.keys(err.keyValue).map(
          (val) => `${val} is already taken`
        );
        errFields = Object.keys(err.keyValue);
      }
    }
    res.status(500).json({ message: message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
};
