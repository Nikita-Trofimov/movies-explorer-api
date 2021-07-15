const Movie = require('../models/movie');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFound = require('../utils/errors/NotFound');
const Forbidden = require('../utils/errors/Forbidden');
const {
  MOVIENOTFOUND,
  MOVIECREATEERROR,
  MOVIEDELETED,
  MOVIEFORBIDDEN,
  USERMOVIENOTFOUND,
  MOVIEIDERORR,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).orFail(new NotFound(USERMOVIENOTFOUND))
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
        throw new BadRequestError(MOVIECREATEERROR);
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
      throw new NotFound(MOVIENOTFOUND);
    })
    .then((movie) => {
      if (String(movie.owner) === req.user._id) {
        movie.remove(movieId)
          .then(() => {
            res.status(200).send({ message: MOVIEDELETED });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        throw new Forbidden(MOVIEFORBIDDEN);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new BadRequestError(MOVIEIDERORR);
      } else {
        next(err);
      }
    })
    .catch(next);
};
