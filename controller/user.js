const User = require("../models/user");
const { validationResult } = require("express-validator");
const { calculateAge } = require("../utilits/utilit");

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
    const id = result !== null ? result._id.toString() : userId;
    if (id !== userId) {
      const error = new Error("User with email id already exists!");
      error.statusCode = 409;
      throw error;
    }
    // check with the status code
    res.status(404).json({ message: "Email not found" });
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
    const user = await User.findById(
      { _id: userId },
      {
        matches: 0,
        githubId: 0,
        linkedinId: 0,
      }
    );
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
  try {
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
      profilePhoto,
      email,
      phoneNumber,
      bio,
      company,
      role,
      workExperience,
      techStack,
      interest,
      QuestionAnswers,
      birthday,
      gender,
      discoverySettings,
      coordinates,
    } = req.body;

    let new_birthday = new Date(birthday);
    const age = calculateAge(new_birthday);
    let [lat, long] = coordinates.split(",");
    const location = {
      type: "Point",
      coordinates: [parseFloat(long), parseFloat(lat)],
    };

    //Check for a user already exist with given email id
    const result = await User.findOne({ email: email }, { _id: 1, privacy: 1 });
    const id = result !== null ? result._id.toString() : userId;
    console.log("result- ", result);
    if (id !== userId) {
      const error = new Error("User with email id already exists!");
      error.statusCode = 409;
      console.log(errors);
      throw error;
    }
    let privacy =
      result !== null ? result.privacy : { profileComplete: true, show: true };
    if (!privacy.profileComplete) {
      privacy.profileComplete = true;
      privacy.show = true;
    }
    // Updating user with the new information

    User.updateOne(
      { _id: userId },
      {
        $set: {
          name: name,
          profilePhoto: profilePhoto,
          bio: bio,
          company: company,
          email: email,
          role: role,
          workExperience: workExperience,
          techStack: techStack,
          interest: interest,
          QuestionAnswers: QuestionAnswers,
          phoneNumber: phoneNumber,
          birthday: birthday,
          gender: gender,
          age: age,
          location: location,
          discoverySettings: discoverySettings,
          "privacy.profileComplete": privacy.profileComplete,
          "privacy.show": privacy.show,
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

exports.updateUserInfo = async (req, res, next) => {
  try {
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
      profilePhoto,
      phoneNumber,
      bio,
      company,
      role,
      workExperience,
      techStack,
      interest,
      QuestionAnswers,
      birthday,
      gender,
      discoverySettings,
      coordinates,
    } = req.body;

    let new_birthday,
      lat,
      long,
      location,
      age,
      discoverySettings_role,
      discoverySettings_gender,
      discoverySettings_radius,
      discoverySettings_ageRange;
    if (birthday) {
      new_birthday = new Date(birthday);
      age = calculateAge(new_birthday);
    }
    if (coordinates) {
      [lat, long] = coordinates.split(",");
      location = {
        type: "Point",
        coordinates: [parseFloat(long), parseFloat(lat)],
      };
    }
    if (discoverySettings) {
      let { role, gender, radius, ageRange } = discoverySettings;
      [
        discoverySettings_role,
        discoverySettings_gender,
        discoverySettings_radius,
        discoverySettings_ageRange,
      ] = [role, gender, radius, ageRange];
    }
    // Updating user with the new information

    User.updateOne(
      {
        _id: userId,
        $or: [
          { name: { $ne: name } },
          { profilePhoto: { $ne: profilePhoto } },
          { bio: { $ne: bio } },
          { role: { $ne: role } },
          { workExperience: { $ne: workExperience } },
          { techStack: { $ne: techStack } },
          { interest: { $ne: interest } },
          { QuestionAnswers: { $ne: QuestionAnswers } },
          { phoneNumber: { $ne: phoneNumber } },
          { birthday: { $ne: birthday } },
          { gender: { $ne: gender } },
          { age: { $ne: age } },
          { location: { $ne: location } },
          { "discoverySettings.role": { $ne: discoverySettings_role } },
          { "discoverySettings.gender": { $ne: discoverySettings_gender } },
          { "discoverySettings.ageRange": { $ne: discoverySettings_ageRange } },
          { "discoverySettings.radius": { $ne: discoverySettings_radius } },
        ],
      },
      {
        $set: {
          name: name,
          profilePhoto: profilePhoto,
          bio: bio,
          company: company,
          role: role,
          workExperience: workExperience,
          techStack: techStack,
          interest: interest,
          QuestionAnswers: QuestionAnswers,
          phoneNumber: phoneNumber,
          birthday: birthday,
          gender: gender,
          age: age,
          location: location,
          "discoverySettings.role": discoverySettings_role,
          "discoverySettings.gender": discoverySettings_gender,
          "discoverySettings.ageRange": discoverySettings_ageRange,
          "discoverySettings.radius": discoverySettings_radius,
        },
      }
    )
      .then((result) => {
        console.log(result);
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
      { $addToSet: { "matches.likedProfiles": likedUserId.userId } }
    );
    res.status(200).json({ message: "liked profile added!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  next();
};

exports.updateDislikedProfiles = async (req, res, next) => {
  const userId = req.userId;
  const dislikedUserId = req.body;
  try {
    const result = await User.updateOne(
      { _id: userId },
      {
        $addToSet: {
          "matches.dislikedProfiles": dislikedUserId.userId,
        },
      }
    );
    res.status(200).json({ message: "Disliked profile added!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  next();
};

// exports.getPossibleMatchingProfiles = (req, res, next) => {
//   // const userId = req.userId;
//   // const include = {
//   //   _id: 0,
//   //   location: 1,
//   //   discoverySettings: 1,
//   // };
//   // // Getting users discovery settings and location
//   // User.findById(userId, include).then((user) => {
//   //   if (!user) {
//   //     const error = new Error("User not found.");
//   //     error.statusCode = 404;
//   //     throw error;
//   //   }
//   //   const query = {
//   //     location: {
//   //       $near: {
//   //         $geometry: user.location,
//   //         $minDistance: 100,
//   //         $maxDistance: user.discoverySettings.radius,
//   //       },
//   //     },
//   //   };
//   //   User.find(query).then((user) => {
//   //     if (!user) {
//   //       const error = new Error("No matches in the given radius");
//   //       error.statusCode = 404;
//   //       throw error;
//   //     }
//   //     res.status(200).json({ user: user });
//   //   });
//   // });

//   const pipeline = [
//     {
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: [77.496034, 9.654886],
//         },
//         distanceField: "distance",
//         maxDistance: 50000,
//         query: {
//           age: {
//             $gte: 18,
//             $lte: 45,
//           },
//           role: "Full-Stack Developer",
//           gender: "Male",
//         },
//         spherical: true,
//       },
//     },
//   ];
// };
