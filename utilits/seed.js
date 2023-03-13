const user = require("../models/user");
const { faker } = require("@faker-js/faker");
const conversations = require("../models/conversations");

console.log(faker.name.firstName());

function seedDb() {
  let timeSeriesData = [];

  for (let i = 0; i < 500; i++) {
    let newDay = {
      name: faker.name.fullName(),
      profilePhoto: "",
      photos: [],
      phoneNumber: 0,
      place: faker.address.cityName(),
      bio: faker.lorem.paragraph(),
      githubId: 0,
      linkedinId: 0,
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      gender: faker.name.sex(),
      email: faker.internet.email(),
      age: faker.datatype.number({ max: 50 }),
      company: "Google",
      role: "Frontend Developer",
      workExperience: "3",
      location: {
        type: "Point",
        coordinates: [79.301195, 23.472885],
      },
      discoverySettings: {
        role: "All",
        gender: "All",
        ageRange: [20, 40],
        radius: 50000,
      },
      privacy: {
        show: true,
        profileComplete: faker.datatype.boolean(),
        block: false,
      },
      subscription: {
        status: false,
        limit: 30,
      },
      techStack: ["Java", "Go", "React"],
      interest: [],
      QuestionAnswers: [],
      socialMedia: {
        linkedIn: "",
        Github: "",
      },
      matches: {
        matchedProfiles: [],
        likedProfiles: [],
        dislikedProfiles: [],
      },
    };

    timeSeriesData.push(newDay);
  }

  user.insertMany(timeSeriesData);
}

function seedConversations() {
  conversations.insertMany([
    {
      fromUserId: "640b091efe6ff8b91be41b07", // sridharaccount
      toUserId: "640b0941fe6ff8b91be41b12", // techswipe user account
    },
    {
      fromUserId: "640b091efe6ff8b91be41b07",
      toUserId: "640b0402c6215f423d7cbfec",
    },
    {
      fromUserId: "640b091efe6ff8b91be41b07",
      toUserId: "640b0402c6215f423d7cbfed",
    },
  ]);
}

module.exports = { seedDb, seedConversations };
