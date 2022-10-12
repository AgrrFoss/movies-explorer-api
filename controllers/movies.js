const Movie = require('../models/movie');
const NotFoundError = require('../errors/not_found');
const NoRightsError = require('../errors/no_rights');
const BadReqError = require('../errors/bad_req');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const owner = req.user._id;
    console.log(owner)
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    res.send(movie);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BadReqError('Переданы некорректные данные при создании записи.');
      next(err);
    } else {
      next(e);
    }
  }
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запись с таким _id не найдена.');
      } else {
        const idString = String(movie.owner);
        if (idString === req.user._id) {
          Movie.deleteOne(movie)
            .then(() => res.send({ message: 'Карточка удалека' }))
            .catch(next);
        } else {
          throw new NoRightsError('Вы не можете удалить чужую карточку');
        }
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный Id карточки.');
        next(err);
      } else {
        next(e);
      }
    });
};
