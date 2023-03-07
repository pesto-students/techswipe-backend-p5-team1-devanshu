const User = require("../models/user");
require("dotenv").config();
const { validationResult } = require("express-validator");
const { calculateAge, createPipeline } = require("../utilits/utilit");
const { response } = require("express");
const { GEOAPIFY_API_KEY } = process.env;

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
      place,
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
          place: place,
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
      privacy,
      place,
    } = req.body;

    let new_birthday,
      lat,
      long,
      location,
      age,
      discoverySettings_role,
      discoverySettings_gender,
      discoverySettings_radius,
      discoverySettings_ageRange,
      show;
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

    if (privacy) {
      show = privacy.show;
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
          { place: { $ne: place } },
          { age: { $ne: age } },
          { location: { $ne: location } },
          { "discoverySettings.role": { $ne: discoverySettings_role } },
          { "discoverySettings.gender": { $ne: discoverySettings_gender } },
          { "discoverySettings.ageRange": { $ne: discoverySettings_ageRange } },
          { "discoverySettings.radius": { $ne: discoverySettings_radius } },
          { "privacy.show": { $ne: show } },
        ],
      },
      {
        $set: {
          name: name,
          profilePhoto: profilePhoto,
          bio: bio,
          company: company,
          role: role,
          place: place,
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
          "privacy.show": show,
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

exports.getReverseGeocode = async (req, res, next) => {
  let { coordinates } = req.body;
  let [latitude, longitude] = coordinates.split(",");

  const axios = require("axios");
  const config = {
    method: "get",
    url: `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`,
    headers: {},
  };

  axios(config)
    .then((response) => {
      const {
        country,
        country_code,
        state,
        state_code,
        state_district,
        county,
      } = response.data.features[0].properties;
      let name = `${county},${state_code},${country_code}`;
      let data = {
        placeName: name,
        country: country,
        country_code: country_code,
        state: state,
        state_code: state_code,
        district: state_district,
        county: county,
      };
      res.status(200).json(data);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
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

exports.getPossibleMatchingProfiles = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  const include = {
    location: 1,
    discoverySettings: 1,
    "matches.likedProfiles": 1,
    "matches.dislikedProfiles": 1,
    techStack: 1,
    interest: 1,
    QuestionAnswers: 1,
    "subscription.limit": 1,
  };
  // Getting users discovery settings and location
  try {
    const user = await User.findById(userId, include);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    const pipeline = createPipeline(user);
    let possibleMatches = await User.aggregate(pipeline);
    res
      .status(200)
      .json({ possibleMatches: possibleMatches, pipeline: pipeline });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
