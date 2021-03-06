const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { VALMOVIEIMG, VALMOVIETRAILER, VALMOVIETHUMBNAIL } = require('../utils/constants');

router.get('/', getMovies);

router.post('/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message(VALMOVIEIMG);
      }),
      trailer: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message(VALMOVIETRAILER);
      }),
      thumbnail: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message(VALMOVIETHUMBNAIL);
      }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie);

router.delete('/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie);

module.exports = router;
