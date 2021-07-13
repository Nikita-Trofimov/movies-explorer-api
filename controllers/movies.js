const Movie = require('../models/movie');
const ValidationError = require('../utils/errors/ValidationError');
const NotFound = require('../utils/errors/NotFound');
const Forbidden = require('../utils/errors/Forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы неккоректные данные при создании фильма');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFound('Фильм по указанному id не найден');
    })
    .then((movie) => {
      if (String(movie.owner) === req.user._id) {
        movie.remove(movieId)
          .then(() => {
            res.status(200).send({ message: 'Фильм удален' });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        throw new Forbidden('Фильм недосутпен пользователю');
      }
    })
    .catch(next);
};
