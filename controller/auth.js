const User = require("../models/user");
const { BASE_URL_FRONTEND, JWT_KEY } = process.env;
const jwt = require("jsonwebtoken");

exports.successGithubLogin = (req, res, next) => {
  if (req.user) {
    console.log("Controller - ", req.user._json);
    User.find({ githubId: req.user._json.id }).then((id_user) => {
      // Check wether user with same email is present
      console.log("User - ", id_user);
      if (id_user.length < 1) {
        console.log("No User with github id ", req.user._json.id);
        //already a user present with linkedIn auth
        if (req.user._json.email !== null) {
          User.find({ email: req.user._json.email }).then((e_user) => {
            if (e_user.length === 1) {
              e_user[0].socialMedia.Github = req.user._json.profileUrl;
              e_user[0]["githubId"] = req.user._json.id;
              e_user[0].save().then((loadedUser) => {
                const token = jwt.sign(
                  {
                    userId: loadedUser._id.toString(),
                  },
                  JWT_KEY,
                  { expiresIn: "1w" }
                );
                res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
              });
            } else {
              const data = {};
              if (req.user._json.name !== "") {
                data["name"] = req.user._json.name;
              }
              if (req.user._json.company !== null) {
                data["company"] = req.user._json.company;
              }
              if (req.user._json.avatar_url !== null) {
                data["profilePhoto"] = req.user._json.avatar_url;
              }
              if (req.user._json.email !== null) {
                data["email"] = req.user._json.email;
              }
              data["socialMedia"] = { Github: req.user.profileUrl };
              data["githubId"] = req.user._json.id;
              console.log("data - ", data);
              const user = new User(data);
              console.log("User- ", user);
              user.save().then((loadedUser) => {
                const token = jwt.sign(
                  {
                    userId: loadedUser._id.toString(),
                  },
                  JWT_KEY,
                  { expiresIn: "1w" }
                );
                res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
              });
            }
          });
        } else {
          // Consider the user be a new user
          const data = {};
          if (req.user._json.name !== "") {
            data["name"] = req.user._json.name;
          }
          if (req.user._json.company !== null) {
            data["company"] = req.user._json.company;
          }
          if (req.user._json.avatar_url !== null) {
            data["profilePhoto"] = req.user._json.avatar_url;
          }
          data["socialMedia"] = { Github: req.user.profileUrl };
          data["githubId"] = req.user._json.id;
          console.log("data - ", data);
          const user = new User(data);
          console.log("User- ", user);
          user.save().then((loadedUser) => {
            const token = jwt.sign(
              {
                userId: loadedUser._id.toString(),
              },
              JWT_KEY,
              { expiresIn: "1h" }
            );
            res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
          });
        }
      } else {
        //Already registered with github user
        console.log("Already with github id", id_user[0]._id);
        const token = jwt.sign(
          {
            userId: id_user[0]._id.toString(),
          },
          JWT_KEY,
          { expiresIn: "1w" }
        );
        res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
      }
    });
  } else {
    res.redirect(`${BASE_URL_FRONTEND}/login?failed=true`);
  }
};

exports.successLinkedinLogin = (req, res, next) => {
  try {
    if (req.user) {
      console.log("User logged in ", req.user.id);
      console.log("email - ", req.user.emails);
      const email =
        req.user.emails.length !== 0 ? req.user.emails[0].value : "";
      const name = req.user.displayName;
      const id = req.user.id;
      let profilePhoto = "";
      console.log("photos", req.user.photos);
      if (req.user.photos) {
        profilePhoto =
          req.user.photos.length !== 0
            ? req.user.photos[req.user.photos.length - 1].value
            : "";
      }

      console.log(
        `UserName = ${name}, email = ${email}, id = ${id}, photo=${req.user.photos} `
      );
      User.find({ linkedinId: id }).then((id_user) => {
        console.log("User - ", id_user);

        if (id_user.length < 1) {
          console.log("No User with linkedin id ", id);
          //Check wether user with same email is present
          if (email !== null && email !== undefined && email !== "") {
            User.find({ email: email })
              .then((e_user) => {
                if (e_user.length === 1) {
                  console.log("User with same email found");
                  e_user[0]["linkedinId"] = id;
                  e_user[0].save().then((loadedUser) => {
                    const token = jwt.sign(
                      {
                        userId: loadedUser._id.toString(),
                      },
                      JWT_KEY,
                      { expiresIn: "1w" }
                    );
                    res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
                  });
                } else {
                  const data = {};
                  if (name !== "") {
                    data["name"] = name;
                  }
                  if (profilePhoto !== "") {
                    data["profilePhoto"] = profilePhoto;
                  }
                  if (email !== null) {
                    data["email"] = email;
                  }
                  data["linkedinId"] = id;
                  console.log("data - ", data);
                  const user = new User(data);
                  console.log("User- ", user);
                  user.save().then((loadedUser) => {
                    const token = jwt.sign(
                      {
                        userId: loadedUser._id.toString(),
                      },
                      JWT_KEY,
                      { expiresIn: "1w" }
                    );
                    res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // Consider the user be a new user
            console.log("No email");
            const data = {};
            if (name !== "") {
              data["name"] = name;
            }
            if (profilePhoto !== 0) {
              data["profilePhoto"] = profilePhoto;
            }
            data["linkedinId"] = id;
            console.log("data - ", data);
            const user = new User(data);
            console.log("User- ", user);
            user.save().then((loadedUser) => {
              const token = jwt.sign(
                {
                  userId: loadedUser._id.toString(),
                },
                JWT_KEY,
                { expiresIn: "1w" }
              );
              res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
            });
          }
        } else {
          //Already registered with github user
          console.log("Already with linedIn id", id);
          const token = jwt.sign(
            {
              userId: id_user[0]._id.toString(),
            },
            JWT_KEY,
            { expiresIn: "1w" }
          );
          res.redirect(`${BASE_URL_FRONTEND}/login?token=${token}`);
        }
      });
    } else {
      console.log("No user found");
      res.redirect(`${BASE_URL_FRONTEND}/login?failed=true`);
    }
  } catch (err) {
    console.log(err);
    res.redirect(`${BASE_URL_FRONTEND}/login?failed=true`);
  }
};
