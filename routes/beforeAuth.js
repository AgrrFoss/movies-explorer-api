const beforeAuthRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { logout, login, createUser } = require('../controllers/users');

beforeAuthRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser,
);
beforeAuthRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);
beforeAuthRouter.post('/signout', logout);

module.exports = beforeAuthRouter;
