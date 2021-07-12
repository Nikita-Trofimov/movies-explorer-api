require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationError = require('../utils/errors/ValidationError');
const AutorizationError = require('../utils/errors/AutorizationError');
const NotFound = require('../utils/errors/NotFound');
const CastError = require('../utils/errors/CastError');
const UserIsExist = require('../utils/errors/UserIsExist');

const SALT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

function errCheck(err, next) {
  if (err.name === 'CastError') {
    next(new CastError('Некорректный ID пользователя'));
  }
  if (err.name === 'ValidationError') {
    next(new ValidationError('Переданы некорректные данные'));
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    next(new UserIsExist('Переданы некорректные данные при создании пользователя'));
  }
  next(err);
}

module.exports.getAuthUser = (req, res, next) => {
  User.findById(req.user._id).orFail(new NotFound('Пользователь не найден'))
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
    .then(() => res.status(200).send({ message: 'Вы зарегистрировались' }))
    .catch((err) => errCheck(err, next));
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name },
    {
      new: true,
      upsert: false,
      runValidators: true,
    }).orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => errCheck(err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password').orFail(new AutorizationError('Пользователь не найден'))
    .then((user) => bcrypt.compare(
      password,
      user.password,
    ).then(
      (isValid) => {
        if (!isValid) {
          throw new AutorizationError('Неверный email или пароль');
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        return res.status(200).cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        }).send({ message: 'Вы успешно авторизовались' })
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
    res.send({ message: 'Вы вышли из системы' });
  } catch (err) {
    next(err);
  }
};
