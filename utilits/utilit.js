exports.calculateAge = (birthday) => {
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
};

exports.createPossibleMatchesPipeline = (user, limit, lastUserId) => {
  const ObjectId = require("mongoose").Types.ObjectId;
  lastUserId = lastUserId === undefined ? "" : new ObjectId(lastUserId);
  const {
    location,
    discoverySettings,
    matches,
    techStack,
    interest,
    questionAnswers,
    subscription,
  } = user;

  let role =
    discoverySettings.role === "All"
      ? [
          "Devops Engineer",
          "Frontend Developer",
          "Software Tester",
          "Full-Stack Developer",
          "Backend Developer",
        ]
      : [discoverySettings.role];
  let gender =
    discoverySettings.gender === "All"
      ? ["Male", "Female", "Other"]
      : [discoverySettings.gender];
  let existingUserIds = matches.likedProfiles.concat(matches.dislikedProfiles);
  let userParameters = techStack.concat(interest).concat(questionAnswers);
  existingUserIds.push(user._id);
  let pipeline = [
    {
      $geoNear: {
        near: location,
        distanceField: "distance",
        maxDistance: discoverySettings.radius,
        query: {
          age: {
            $gte: discoverySettings.ageRange[0],
            $lte: discoverySettings.ageRange[1],
          },
          role: {
            $in: role,
          },
          gender: {
            $in: gender,
          },
          _id: {
            $nin: existingUserIds,
          },
        },
        spherical: true,
      },
    },
    {
      $project: {
        name: 1,
        profilePhoto: 1,
        bio: 1,
        birthday: 1,
        gender: 1,
        age: 1,
        company: 1,
        role: 1,
        workExperience: 1,
        techStack: 1,
        interest: 1,
        QuestionAnswers: 1,
        distance: 1,
      },
    },
    {
      $addFields: {
        parameters: {
          $concatArrays: [
            {
              $ifNull: ["$techStack", []],
            },
            {
              $ifNull: ["$interest", []],
            },
            {
              $ifNull: ["$QuestionAnswers", []],
            },
          ],
        },
      },
    },
    {
      $addFields: {
        sharedInterest: {
          $setIntersection: ["$parameters", userParameters],
        },
      },
    },
    {
      $addFields: {
        commonValues: {
          $size: {
            $ifNull: ["$sharedInterest", []],
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $match: {
        $expr: {
          $gt: [
            {
              $ifNull: ["$_id", new ObjectId("000000000000000000000000")],
            },
            lastUserId,
          ],
        },
      },
    },
    {
      $limit: limit,
    },
  ];
  return pipeline;
};

exports.createHotPipeline = (user, limit) => {
  let gender = user.discoverySettings.gender === "Male" ? "Male" : "Female";
  let existingUserIds = user.matches.likedProfiles.concat(
    user.matches.dislikedProfiles
  );
  existingUserIds.push(user._id);
  let pipeline = [
    {
      $match: {
        hotProfile: true,
        gender: gender,
        _id: {
          $nin: existingUserIds,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $limit: limit,
    },
  ];
  return pipeline;
};

exports.createMatchesPipeline = (matchedIds) => {
  const pipeline = [
    {
      $match: {
        _id: {
          $in: matchedIds,
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        profilePhoto: 1,
      },
    },
  ];

  return pipeline;
};
exports.getCurrentISTDate = () => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  };
  const currentDate = new Date().toLocaleString("en-US", options);
  console.log(currentDate);
  return currentDate + "Z";
};
