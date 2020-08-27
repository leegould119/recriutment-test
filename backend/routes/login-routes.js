const router = require('express').Router();
const bcrypt = require('bcrypt');
// setup routes for a simple app
const Login = require('../schemas/authSchema');
const RefreshToken = require('../schemas/refreshTokenSchema');
const jwt = require('jsonwebtoken');
const verifyToken = require('./veriryToken');

// register endpoint
// requires username (email), and password
// are encrypted using bcrypt
// the password is encrypted and stored into the DB
router.post('/register', async (req, res, next) => {
  const userName = req.body.userName,
    userPassword = req.body.userPassword;
  const user = await Login.findOne({ userName });
  if (!user) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(userPassword, salt, (err, hash) => {
        const newLogin = new Login({
          userName,
          userPassword: hash,
          passwordResetToken: ''
        });
        newLogin
          .save()
          .then((user) => {
            res.status(200).json({
              messageWrapper: {
                message: 'user created successfully',
                messageType: 'success'
              },
              user
            });
          })
          .catch((err) => {
            res.status(500).json({
              messageWrapper: {
                message: 'something went wrong please try again soon',
                messageType: 'error'
              },
              err
            });
          });
      });
    });
  } else {
    res.status(200).json({
      messageWrapper: {
        message: ' user already exists with this email adress',
        messageTypepe: 'error'
      }
    });
  }
});

// login endpoint
// requires username and password
//  a token is returned with the lifespan of 30 minutes
// a refresh token is returned and saved in the DB
router.post('/login', async (req, res, next) => {
  console.log(req.body.userPassword);
  const userName = req.body.userName,
    userPassword = req.body.userPassword;
  const user = await Login.findOne({ userName });

  // res.send({ user });
  if (user) {
    const hash = user.userPassword;
    const userId = user._id;

    bcrypt.compare(userPassword, hash, (err, result) => {
      if (result == true) {
        const accessToken = generateAccessToken(userId);
        const refreshToken = jwt.sign(
          { userId },
          process.env.JWT_REFRESH_TOKEN_SECRET
        );

        const newRefreshToken = new RefreshToken({
          refreshToken: refreshToken
        });

        newRefreshToken
          .save()
          .then((data) => {
            res.status(200).json({
              messageWrapper: {
                message: ' you have successfully logged in',
                messageType: 'success'
              },
              accessToken: accessToken,
              refreshToken: data.refreshToken,
              creationDate: data.creationDate
            });
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        res.status(200).json({
          messageWrapper: {
            message: 'please make sure your credentials are correct',
            messageType: 'error'
          }
        });
      }
    });
  } else {
    res.status(200).json({
      messageWrapper: {
        message: 'user data does not exitst',
        messageType: 'error'
      }
    });
  }
});

//  forgot the password endpoint
router.post('/forgot-password', async (req, res, next) => {
  const userName = req.body.userName;

  const user = await Login.findOne({ userName });
  if (!user) {
    return res.status(400).json({
      messageWrapper: {
        message: 'no user found, please make sure your username is correct',
        messageType: 'error'
      }
    });
  } else {
    const passwordResetToken = Math.random().toString(36).slice(-8);
    const update = {
      userName: user.userName,
      userPassword: user.userPassword,
      passwordResetToken: passwordResetToken
    };
    const option = {
      new: true
    };
    Login.findOneAndUpdate(userName, update, option)
      .then((data) => {
        res.json({
          messageWrapper: {
            message:
              'please reset your password with this code: ' +
              data.passwordResetToken,
            messageType: 'success'
          },
          data
        });
        next();
      })
      .catch((err) => {
        res.send(err);
        next();
      });
  }
});

// reset the password using this endpoint after recieving and email normally, in this case the message will be displayed in the frontend.
router.post('/reset-password', async (req, res, next) => {
  const passwordResetToken = req.body.resetToken,
    newPassword = req.body.newPassword;
  try {
    const user = await Login.findOne({ passwordResetToken });
    if (!user)
      return res.json({
        messageWrapper: {
          message: 'reset token expired, or has been used',
          messageType: 'error'
        }
      });
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        const userName = user.userName;

        const update = {
          userName: user.userName,
          userPassword: hash,
          passwordResetToken: ''
        };
        const option = {
          new: true
        };

        // res.json({ update });
        Login.findOneAndUpdate(userName, update, option)
          .then((data) => {
            res.status(200).json({
              messageWrapper: {
                message:
                  'your password has successfully been changes. please login',
                messageType: 'success'
              },
              data
            });
          })
          .catch((err) => {
            res.send(err);
          });
      });
    });
  } catch (err) {
    res.send(err);
  }
});

// refresh the access token using the refresh token
router.post('/token', (req, res, next) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  RefreshToken.find({ refreshToken: refreshToken })
    .then((data) => {
      const refreshToken = data[0].refreshToken;
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = generateAccessToken(user.userId);
          res.json({ accessToken: accessToken });
        }
      );
    })
    .catch((err) => {
      res.json(err);
    });
});

// delete the current refresh token and logout

router.delete('/logout', (req, res, next) => {
  const refreshToken = req.body.token;

  RefreshToken.findOneAndDelete({ refreshToken: refreshToken })
    .then((resp) => {
      // invalidate the refresh token in one second
      jwt.sign({ name: 'expires' }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '1000'
      });
      // send a response that the refresh token has been deleted from the db
      res.json({
        messageWrapper: {
          message: 'you have successfully logged out.',
          messageType: 'success'
        },
        resp
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

// generate access token middleware
function generateAccessToken(userId) {
  const authToken = jwt.sign({ userId }, process.env.JWT_AUTH_TOKEN_SECRET, {
    expiresIn: '30m'
  });
  return authToken;
}

module.exports = router;
