/* eslint-disable no-useless-escape */
const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

/*
moviesRouter.get('/', getMovies);

moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(50),
      director: Joi.string().required().min(2).max(50),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required().min(2),
      image: Joi.string().required().min(7).pattern(/^(https?:\/\/)([\w\.]+)\.[a-z{2, 6}]/),
      trailerLink: Joi.string().required().min(7).pattern(/^(https?:\/\/)([\w\.]+)\.[a-z{2, 6}]/),
      thumbnail: Joi.string().required().min(7).pattern(/^(https?:\/\/)([\w\.]+)\.[a-z{2, 6}]/),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().min(2).max(50),
      nameEN: Joi.string().required().min(2).max(50),
    }),
  }),
  createMovie,
);

moviesRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().pattern(/[\da-f]{24}/),
    }),
  }),
  deleteMovie,
);
*/
moviesRouter.get('/movies', getMovies);

moviesRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(50),
      director: Joi.string().required().min(2).max(50),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required().min(2),
      image: Joi.string().required().min(7).pattern(/^(https?:\/\/)([\w\.]+)\.[a-z{2, 6}]/),
      trailerLink: Joi.string().required().min(7).pattern(/^(https?:\/\/)([\w\.]+)\.[a-z{2, 6}]/),
      thumbnail: Joi.string().required().min(7).pattern(/^(https?:\/\/)([\w\.]+)\.[a-z{2, 6}]/),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().min(2).max(50),
      nameEN: Joi.string().required().min(2).max(50),
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
