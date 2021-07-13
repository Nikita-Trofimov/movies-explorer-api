const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const NotFound = require('../utils/errors/NotFound');
const movieRouter = require('./movies');
const userRouter = require('./users');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
  }),
}), login);

router.get('/logout', logout);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use(auth);

router.use(() => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
