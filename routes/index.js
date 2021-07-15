const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const NotFound = require('../utils/errors/NotFound');
const movieRouter = require('./movies');
const userRouter = require('./users');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NOTFOUND } = require('../utils/constants');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
  }),
}), login);

router.use(auth);

router.get('/logout', logout);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use(() => {
  throw new NotFound(NOTFOUND);
});

module.exports = router;
