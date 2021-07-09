const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isUrl(v),
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isUrl(v),
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isUrl(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: (v) => validator.isUrl(v),
    },
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: (v) => validator.isUrl(v),
    },
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isUrl(v),
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isUrl(v),
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
