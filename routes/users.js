const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  logout, login, createUser, getUser, updateUser,
} = require('../controllers/users');

/*
userRouter.get('/', getUser);
userRouter.patch(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
    }),
  }),
  updateUser,
);
*/
userRouter.get('/users/me', getUser);

userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
    }),
  }),
  updateUser,
);

module.exports = userRouter;
