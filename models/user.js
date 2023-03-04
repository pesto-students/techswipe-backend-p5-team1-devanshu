const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  photos: {
    type: Array,
  },
  phoneNumber: {
    type: Number,
  },
  bio: {
    type: String,
  },
  githubId: {
    type: Number,
  },
  linkedinId: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
  company: {
    type: String,
  },
  role: {
    type: String,
  },
  workExperience: {
    type: String,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: Array,
      default: [79.301195, 23.472885],
    },
  },
  discoverySettings: {
    role: {
      type: String,
      default: "All",
      required: true,
    },
    gender: {
      type: String,
      default: "All",
      required: true,
    },
    ageRange: {
      type: Array,
      default: [20, 40],
      required: true,
    },
    radius: {
      type: Number,
      default: 50000,
      required: true,
    },
  },
  privacy: {
    show: {
      type: Boolean,
      default: true,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  techStack: [
    {
      techStackName: String,
      techStackIcon: String,
    },
  ],
  interest: [
    {
      interestName: String,
      interestIcon: String,
    },
  ],
  QuestionAnswers: [
    {
      question: String,
      answer: String,
    },
  ],
  socialMedia: {
    linkedIn: String,
    Github: String,
  },
  matches: {
    matchedProfiles: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likedProfiles: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikedProfiles: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
