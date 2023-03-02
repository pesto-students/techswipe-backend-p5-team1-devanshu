const User = require("../models/user");
const { validationResult, Result } = require("express-validator");
const user = require("../models/user");

exports.profileStatus = async (req, res, next) => {
  const userId = req.userId;
  try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ profileStatus: user.privacy });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.checkEmailAlreadyExists = async (req, res, next) => {
  const userId = req.userId;
  const email = req.body.email;
  try {
    const validation_errors = validationResult(req);
    if (!validation_errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = validation_errors.array();
      throw error;
    }
    const result = await User.findOne({ email: email }, { _id: 1 });
    const id = result._id.toString();
    if (id !== userId) {
      const error = new Error("User with email id already exists!");
      error.statusCode = 409;
      throw error;
    }
    // check with the status code
    res.status(200).json({ message: "Email not found" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserInfo = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ User: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addUserInfo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    console.log(errors);
    throw error;
  }
  const userId = req.userId;
  const {
    name,
    email,
    phoneNumber,
    birthday,
    gender,
    discoverySettings,
    coordinates,
  } = req.body;

  let new_birthday = new Date(birthday);
  const age = calculateAge(new_birthday);
  const location = {
    type: "Point",
    coordinates: coordinates,
  };

  try {
    //Check for a user already exist with given email id
    const result = await User.findOne({ email: email }, { _id: 1 });
    const id = result._id.toString();
    if (id !== userId) {
      const error = new Error("User with email id already exists!");
      error.statusCode = 409;
      console.log(errors);
      throw error;
    }
    // Updating user with the new information
    User.updateOne(
      { _id: userId },
      {
        $set: {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          birthday: birthday,
          gender: gender,
          age: age,
          location: location,
          discoverySettings: discoverySettings,
        },
      }
    )
      .then((result) => {
        res.status(200).json({ message: "User Updated!" });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateLikedProfiles = async (req, res, next) => {
  const userId = req.userId;
  const likedUserId = req.body;
  try {
    const result = await User.updateOne(
      { _id: userId },
      { $addToSet: { "matches.likedProfiles": likedUserId } }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "liked profile added!" });
    } else {
      res.status(409).json({ message: "Adding liked profile fails!" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  next();
  //Discuss logic for finding matches
};

exports.updateDislikedProfiles = async (req, res, next) => {
  const userId = req.userId;
  const dislikedUserId = req.body;
  try {
    const result = await User.updateOne(
      { _id: userId },
      { $addToSet: { "matches.dislikedProfiles": dislikedUserId } }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Disliked profile added!" });
    } else {
      res.status(409).json({ message: "Adding disliked profile fails!" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  next();
};

// exports.getMatchedProfiles = (req, res, next) => {
//   const userId = req.userId;
//   const include = {
//     _id: 0,
//     location: 1,
//     discoverySettings: 1,
//   };
//   // Getting users discovery settings and location
//   User.findById(userId, include).then((user) => {
//     if (!user) {
//       const error = new Error("User not found.");
//       error.statusCode = 404;
//       throw error;
//     }

//     const query = {
//       location: {
//         $near: {
//           $geometry: user.location,
//           $minDistance: 100,
//           $maxDistance: user.discoverySettings.radius,
//         },
//       },
//     };

//     User.find(query).then((user) => {
//       if (!user) {
//         const error = new Error("No matches in the given radius");
//         error.statusCode = 404;
//         throw error;
//       }
//       res.status(200).json({ user: user });
//     });
//   });
// };

function calculateAge(birthday) {
  const birthYear = birthday.getFullYear();
  const birthMonth = birthday.getMonth();
  const birthDate = birthday.getDate();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  let age = currentYear - birthYear;

  if (currentMonth < birthMonth) {
    age--;
  } else if (currentMonth === birthMonth && currentDate < birthDate) {
    age--;
  }

  return age;
}
