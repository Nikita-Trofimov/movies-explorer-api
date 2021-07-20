const rateLimit = require('express-rate-limit');

const DEVJWT = 'dev-secret';
const EXPIRESJWT = '7d';
const SALT_ROUNDS = 10;

const CORSOPTIONS = {
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

const MONGODEV = 'mongodb://localhost:27017/bitfilmsdb';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = {
  DEVJWT,
  EXPIRESJWT,
  SALT_ROUNDS,
  CORSOPTIONS,
  MONGODEV,
  limiter,
};
