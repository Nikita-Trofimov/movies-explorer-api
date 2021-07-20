require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const AutorizationError = require('../utils/errors/AutorizationError');
const { DEVJWT } = require('../utils/conf');
const { AUTHERROR } = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEVJWT);
  } catch (err) {
    throw new AutorizationError(AUTHERROR);
  }

  req.user = payload;

  next();
};
