require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationError = require('../utils/errors/ValidationError');
const AutorizationError = require('../utils/errors/AutorizationError');
const NotFound = require('../utils/errors/NotFound');
const UserIsExist = require('../utils/errors/UserIsExist');
const {
  USERIDERORR,
  USERDATAERORR,
  USERNOTFOUND,
  USERREGISTRED,
  USERWRONGEMAIL,
  USERAUTHSUCCESS,
  USERLOGOUT,
  USERISEXIST,
} = require('../utils/constants');
const { DEVJWT, EXPIRESJWT, SALT_ROUNDS } = require('../utils/conf');

const { NODE_ENV, JWT_SECRET } = process.env;

function errCheck(err, next) {
  if (err.name === 'CastError') {
    next(new ValidationError(USERIDERORR));
  }
  if (err.name === 'ValidationError') {
    next(new ValidationError(USERDATAERORR));
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    next(new UserIsExist(USERISEXIST));
  }
  next(err);
}

module.exports.getAuthUser = (req, res, next) => {
  User.findById(req.user._id).orFail(new NotFound(USERNOTFOUND))
    .then((user) => res.status(200).send(user))
    .catch((err) => errCheck(err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => res.status(200).send({ message: USERREGISTRED }))
    .catch((err) => errCheck(err, next));
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name },
    {
      new: true,
      upsert: false,
      runValidators: true,
    }).orFail(new NotFound(USERNOTFOUND))
    .then((user) => res.send(user))
    .catch((err) => errCheck(err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password').orFail(new NotFound(USERNOTFOUND))
    .then((user) => bcrypt.compare(
      password,
      user.password,
    ).then(
      (isValid) => {
        if (!isValid) {
          throw new AutorizationError(USERWRONGEMAIL);
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : DEVJWT,
          { expiresIn: EXPIRESJWT },
        );
        return res.status(200).cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        }).send({ message: USERAUTHSUCCESS })
          .end();
      },
    ))
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    });
    res.send({ message: USERLOGOUT });
  } catch (err) {
    next(err);
  }
};
