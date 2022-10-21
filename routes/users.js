const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, updateUser } = require('../controllers/users');

userRouter.get('/users/me', getUser);

userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().email(),
    }),
  }),
  updateUser,
);

module.exports = userRouter;
