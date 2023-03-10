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
  place: {
    type: String,
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
      default: "Female",
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
      default: false,
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
  subscription: {
    status: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 30,
    },
  },
  techStack: Array,
  interest: Array,
  questionAnswers: Array,
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
  dailyProfileViewCount: {
    type: Number,
    default: 0,
  },
  lastProfileViewDate: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
