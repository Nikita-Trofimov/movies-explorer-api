const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const serverError = require('./middlewares/serverError');

const options = {
  origin: [
    'http://localhost:3000',
    'https://api.nikita-mesto.nomoredomains.club',
    'https://nikita-mesto.nomoredomains.monster',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const { PORT = 3000, NODE_ENV, DATABASE_URL } = process.env;
const app = express();

app.use('*', cors(options));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(limiter);

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(serverError);

app.listen(PORT);
