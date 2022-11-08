const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadReqError = require('../errors/bad_req');
const NotFoundError = require('../errors/not_found');
const RepeatEmailError = require('../errors/repeat_email_error');

const { NODE_ENV = 'develop', JWT_SECRET = 'dev1' } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name })
        .then((user) => {
          const userInfo = user.toObject();
          delete userInfo.password;
          res.send(userInfo);
        })
        .catch((e) => {
          if (e.code === 11000) {
            const err = new RepeatEmailError('Пользователь с таким адресом уже зарегистрирован');
            next(err);
            return;
          }
          if (e.name === 'ValidationError') {
            const err = new BadReqError('Переданны некорректные данные при создании пользователя');
            next(err);
          } else {
            next(e);
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev1',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
        .send({ token })
        .end();
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt', {
    sameSite: 'none',
    secure: true,
  })
    .send({ message: 'cookie удалены' })
    .end();
  next();
};

/** Функция находит пользователя и выдает объект с данными.
 * id пользователя передается в body запроса.
 */
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('пользователь с таким Id не найден');
      }
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('пользователь с переданным id  не найден.');
      }
    })
    .catch((e) => {
      if (e.code === 11000) {
        const err = new RepeatEmailError('Пользователь с таким адресом уже зарегистрирован');
        next(err);
        return;
      }
      if (e.name === 'validationError') {
        const err = new BadReqError('Неверный тип данных');
        next(err);
        return;
      }
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный _id юзера');
        next(err);
      } else {
        next(e);
      }
    });
};
