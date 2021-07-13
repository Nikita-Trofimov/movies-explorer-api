const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const serverError = require('./middlewares/serverError');
const { CORSOPTIONS, MONGODEV, limiter } = require('./utils/conf');

const { PORT = 3000, NODE_ENV, DATABASE_URL } = process.env;
const app = express();

app.use('*', cors(CORSOPTIONS));

app.use(helmet());
app.use(limiter);

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : MONGODEV, {
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
