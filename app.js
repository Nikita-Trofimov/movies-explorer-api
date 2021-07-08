const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const { celebrate, Joi } = require('celebrate');
// const { errors } = require('celebrate');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const cors = require('cors');
// const cardRoutes = require('./routes/cards');
// const userRoutes = require('./routes/users');
// const NotFound = require('./utils/errors/NotFound');
// const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { login, createUser, logout } = require('./controllers/users');
// const auth = require('./middlewares/auth');
// const serverError = require('./middlewares/serverError');

// const options = {
//   origin: [
//     'http://localhost:3000',
//     'https://api.nikita-mesto.nomoredomains.club',
//     'https://nikita-mesto.nomoredomains.monster',
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
//   credentials: true,
// };

const { PORT = 3000 } = process.env;
const app = express();

// app.use('*', cors(options));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });

// app.use(helmet());
// app.use(limiter);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// app.use(bodyParser.json());
// app.use(cookieParser());

// app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(4).required(),
//   }),
// }), login);

// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(4).required(),
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
// eslint-disable-next-line max-len
//     avatar: Joi.string().pattern(/https?:\/\/(www\.)?[\w-]+(\.[a-z]+)[\w-._~:/?#@!$&'()*+,;=%]*#?/),
//   }),
// }), createUser);

// app.use('/logout', logout);

// app.use(auth);

// app.use(cardRoutes);
// app.use(userRoutes);

// app.use(() => {
//   throw new NotFound('Запрашиваемый ресурс не найден');
// });

// app.use(errorLogger);

// app.use(errors());

// app.use(serverError);

// app.listen(PORT);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
