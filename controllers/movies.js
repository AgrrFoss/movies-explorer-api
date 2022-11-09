const Movie = require('../models/movie');
const NotFoundError = require('../errors/not_found');
const NoRightsError = require('../errors/no_rights');
const BadReqError = require('../errors/bad_req');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });// проверить правильность работы этого
    // метода и выдаваемых им карточек. Сохраненные карточки должы принадлежать владельцу.
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
 // Movie.findById(req.params.movieId)
  Movie.findOne({ movieId: req.params.movieId, owner: req.user._id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запись с таким _id не найдена.');
      } else {
        const idString = String(movie.owner);
        if (idString === req.user._id) {
          Movie.deleteOne(movie)
            .then(() => res.send({ message: 'Карточка удалена' }))
            .catch(next);
        } else {
          throw new NoRightsError(`Вы не можете удалить чужую карточку ${movie.owner} ${req.user._id}`);
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
