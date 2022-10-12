const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const reg = require('../utils/constants');

moviesRouter.get('/movies', getMovies);

moviesRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(reg),
      trailerLink: Joi.string().required().pattern(reg),
      thumbnail: Joi.string().required().pattern(reg),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

moviesRouter.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().pattern(/[\da-f]{24}/),
    }),
  }),
  deleteMovie,
);

module.exports = moviesRouter;
