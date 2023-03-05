const { check } = require("express-validator");

exports.addUserInfoValidator = [
  check("name").trim().notEmpty().withMessage("Name is required"),
  check("email").isEmail().trim().withMessage("Email is invalid"),
  check("birthday")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Invalid birthday format"),
  check("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender value"),
  check("discoverySettings.role")
    .isIn([
      "All",
      "Full-Stack Developer",
      "Backend Developer",
      "Frontend Developer",
      "Devops Engineer",
      "Software Tester",
    ])
    .withMessage("Discovery role is required"),
  check("discoverySettings.gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid discovery gender value"),
  check("discoverySettings.ageRange")
    .isArray({ min: 2, max: 2 })
    .withMessage("Age range must be an array with two elements"),
  check("discoverySettings.ageRange.*")
    .isInt({ min: 18 })
    .withMessage("Age range values must be integers greater than 18"),
  check("discoverySettings.radius")
    .isInt({ min: 1000 })
    .withMessage("Radius must be an integer greater than 1 km"),
  check("profilePhoto")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Invalid profile url"),
  check("phoneNumber")
    .trim()
    .isMobilePhone("en-IN")
    .optional({ nullable: true })
    .withMessage("Invalid Phone number"),
  check("bio").trim().not().isEmpty().withMessage("Invalid bio"),
  check("company").trim().not().isEmpty().withMessage("Invalid comapny name"),
  check("role")
    .trim()
    .isIn([
      "All",
      "Full-Stack Developer",
      "Backend Developer",
      "Frontend Developer",
      "Devops Engineer",
      "Software Tester",
    ])
    .not()
    .isEmpty()
    .withMessage("Invalid role"),
  check("workExperience")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Invalid workExperience"),
  check("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender value"),
  check("techStack")
    .isArray({ min: 3 })
    .withMessage("TechStack Must contain minimum 3 elements"),
  check("interest")
    .isArray({ min: 3 })
    .withMessage("Interest Must contain minimum 3 elements"),
  check("QuestionAnswers")
    .not()
    .isEmpty()
    .withMessage("QuestionAnswers must not be empty"),
  check("coordinates")
    .isLatLong()
    .withMessage("Invalid latitude and logtitude"),
];

exports.updateUserInfoValidator = [
  check("name")
    .trim()
    .notEmpty()
    .optional({ nullable: true })
    .withMessage("Name is required"),
  check("birthday")
    .isDate({ format: "YYYY-MM-DD" })
    .optional({ nullable: true })
    .withMessage("Invalid birthday format"),
  check("gender")
    .isIn(["Male", "Female", "Other"])
    .optional({ nullable: true })
    .withMessage("Invalid gender value"),
  check("discoverySettings.role")
    .isIn([
      "All",
      "Full-Stack Developer",
      "Backend Developer",
      "Frontend Developer",
      "Devops Engineer",
      "Software Tester",
    ])
    .optional({ nullable: true })
    .withMessage("Discovery role is required"),
  check("discoverySettings.gender")
    .isIn(["Male", "Female", "Other"])
    .optional({ nullable: true })
    .withMessage("Invalid discovery gender value"),
  check("discoverySettings.ageRange")
    .isArray({ min: 2, max: 2 })
    .optional({ nullable: true })
    .withMessage("Age range must be an array with two elements"),
  check("discoverySettings.ageRange.*")
    .isInt({ min: 18 })
    .optional({ nullable: true })
    .withMessage("Age range values must be integers greater than 18"),
  check("discoverySettings.radius")
    .isInt({ min: 1000 })
    .optional({ nullable: true })
    .withMessage("Radius must be an integer greater than 1 km"),
  check("profilePhoto")
    .trim()
    .not()
    .isEmpty()
    .optional({ nullable: true })
    .withMessage("Invalid profile url"),
  check("phoneNumber")
    .trim()
    .isMobilePhone("en-IN")
    .optional({ nullable: true })
    .withMessage("Invalid Phone number"),
  check("bio")
    .trim()
    .not()
    .isEmpty()
    .optional({ nullable: true })
    .withMessage("Invalid bio"),
  check("company")
    .trim()
    .not()
    .isEmpty()
    .optional({ nullable: true })
    .withMessage("Invalid comapny name"),
  check("role")
    .trim()
    .isIn([
      "All",
      "Full-Stack Developer",
      "Backend Developer",
      "Frontend Developer",
      "Devops Engineer",
      "Software Tester",
    ])
    .not()
    .isEmpty()
    .optional({ nullable: true })
    .withMessage("Invalid role"),
  check("workExperience")
    .trim()
    .not()
    .isEmpty()
    .optional({ nullable: true })
    .withMessage("Invalid workExperience"),
  check("gender")
    .isIn(["Male", "Female", "Other"])
    .optional({ nullable: true })
    .withMessage("Invalid gender value"),
  check("techStack")
    .isArray({ min: 3 })
    .optional({ nullable: true })
    .withMessage("TechStack Must contain minimum 3 elements"),
  check("interest")
    .isArray({ min: 3 })
    .optional({ nullable: true })
    .withMessage("Interest Must contain minimum 3 elements"),
  check("QuestionAnswers")
    .not()
    .isEmpty()
    .optional({ nullable: true })
    .withMessage("QuestionAnswers must not be empty"),
  check("coordinates")
    .isLatLong()
    .optional({ nullable: true })
    .withMessage("Invalid latitude and logtitude"),
];

exports.emailValidator = [
  check("email").isEmail().trim().withMessage("Invalid email address"),
];
