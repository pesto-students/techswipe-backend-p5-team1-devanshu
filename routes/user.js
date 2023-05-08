const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const { isAuth } = require("../middleware/is-auth");
const {
  addBasicUserValidator,
  addPersonalUserValidator,
  emailValidator,
  updateUserInfoValidator,
  locationValidator,
} = require("../utils/validators");

router.put(
  "/personal-info",
  isAuth,
  addPersonalUserValidator,
  userController.addPersonalUserInfo
);

router.put(
  "/basic-info",
  isAuth,
  addBasicUserValidator,
  userController.addBasicUserInfo
);

router.put(
  "/update-info",
  isAuth,
  updateUserInfoValidator,
  userController.updateUserInfo
);

router.get("/profile-status", isAuth, userController.profileStatus);
router.post(
  "/isEmailExist",
  isAuth,
  emailValidator,
  userController.checkEmailAlreadyExists
);
router.get("/info", isAuth, userController.getUserInfo);
router.post("/profile-upload", isAuth, userController.uploadProfileImage);
router.post(
  "/reverse-geocode",
  isAuth,
  locationValidator,
  userController.getReverseGeocode
);
router.put("/liked-profile", isAuth, userController.updateLikedProfiles);
router.put("/disliked-profile", isAuth, userController.updateDislikedProfiles);

router.get("/matchUserInfo/:userId", isAuth, userController.getMatchedUserInfo);

router.get(
  "/possible-profiles",
  isAuth,
  userController.getPossibleMatchingProfiles
);
router.get("/matchedProfiles", isAuth, userController.getMatchedProfiles);

router.get("/randomUser", userController.guestUserLogin);
router.get("/conversationsList", isAuth, userController.getUserConversation);

module.exports = router;
