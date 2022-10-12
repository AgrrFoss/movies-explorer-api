const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth_err');

const { JWT_SECRET = 'dev1' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const err = new AuthError('Необходима авторизация. отсутствует токен');
    next(err);
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    const err = new AuthError('Необходима авторизация. Ваш токен не действителен');
    next(err);
    return;
  }
  console.log(payload)
  req.user = payload;
  next();
};
