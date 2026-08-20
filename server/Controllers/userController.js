const UserModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Name, Email and Password are required!!",
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        responseCode: "409",
        responseMessage: "User already exists, you can login!!",
      });
    }

    const userModel = new UserModel({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      authProvider: "local",
    });

    await userModel.save();

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Signup successful!!",
      data: {
        id: userModel._id,
        name: userModel.name,
        email: userModel.email,
        username: userModel.username,
        title: userModel.title,
        avatar: userModel.avatar,
        theme: userModel.theme,
        color: userModel.color,
        authProvider: userModel.authProvider,
      },
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Email and password are required!!",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "User not found!!",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Please login using Google!!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({
        responseCode: "403",
        responseMessage: "Invalid email or password!!",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Login successful!!",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        title: user.title,
        avatar: user.avatar,
        theme: user.theme,
        color: user.color,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Google credential is required!!",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    if (!email || !googleId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Invalid Google account details!!",
      });
    }

    let user = await UserModel.findOne({ googleId });

    if (!user) {
      user = await UserModel.findOne({ email });
    }

    if (user) {
      if (user.authProvider === "local" && !user.googleId) {
        return res.status(409).json({
          responseCode: "409",
          responseMessage: "An account already exists, you can login!!",
        });
      }

      user.googleId = googleId;

      if (name) {
        user.name = name;
      }

      if (picture) {
        user.avatar = picture;
      }

      user.authProvider = "google";

      await user.save();
    } else {
      user = new UserModel({
        name: name || "Google User",
        email,
        googleId,
        authProvider: "google",
        avatar: picture || "",
      });

      await user.save();
    }

    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Google login successful!!",
      token,

      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        title: user.title,
        avatar: user.avatar,
        theme: user.theme,
        color: user.color,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Google login failed!!",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).select("-password");

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "User data fetched successfully!!",
      data: users,
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, username, title, password, avatar, theme, color } =
      req.body;

    const { id } = req.params;

    console.log("UPDATE USER ID:", id);
    console.log("UPDATE USER BODY:", req.body);

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "User not found!!",
      });
    }

    if (name !== undefined && name !== "") {
      user.name = name;
    }

    if (email !== undefined && email !== "") {
      user.email = email;
    }

    if (username !== undefined && username.trim() !== "") {
      user.username = username.trim();
    }

    if (title !== undefined) {
      user.title = title;
    }

    if (password !== undefined && password !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    if (theme !== undefined) {
      user.theme = theme;
    }

    if (color !== undefined) {
      user.color = color;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    console.log("USER UPDATED SUCCESSFULLY:", updatedUser);

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "User updated successfully!!",
      data: updatedUser,
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    console.error("ERROR MESSAGE:", err.message);

    if (err.code === 11000) {
      return res.status(409).json({
        responseCode: "409",
        responseMessage:
          "Username or email already exists. Please use another one.",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: Object.values(err.errors)
          .map((error) => error.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const updateTheme = async (req, res) => {
  try {
    const { theme, color } = req.body;
    const { id } = req.params;

    if (!theme) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Theme is required!!",
      });
    }

    const updateData = {
      theme,
    };

    if (color !== undefined) {
      updateData.color = color;
    }

    const updatedTheme = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedTheme) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "User not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Theme updated successfully!!",
      data: updatedTheme,
    });
  } catch (err) {
    console.error("UPDATE THEME ERROR:", err);

    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const guestLogin = async (req, res) => {
  try {
    const guestEmail = `guest_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}@guest.local`;

    const guestName = "Guest User";

    const guestPassword = Math.random().toString(36) + Date.now();

    const guestUser = new UserModel({
      name: guestName,
      email: guestEmail,
      password: await bcrypt.hash(guestPassword, 10),
      authProvider: "guest",
    });

    await guestUser.save();

    const token = jwt.sign(
      {
        email: guestUser.email,
        _id: guestUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Guest login successful!!",
      token,

      data: {
        id: guestUser._id,
        name: guestUser.name,
        email: guestUser.email,
        username: guestUser.username,
        title: guestUser.title,
        avatar: guestUser.avatar,
        theme: guestUser.theme,
        color: guestUser.color,
        authProvider: guestUser.authProvider,
      },
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Guest login failed!!",
    });
  }
};

module.exports = {
  signupUser,
  loginUser,
  googleLogin,
  getUsers,
  updateUser,
  updateTheme,
  guestLogin,
};
