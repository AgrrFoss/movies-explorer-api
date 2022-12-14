const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { createUser, login, logout } = require('./controllers/users');
const NotFoundError = require('./errors/not_found');
const auth = require('./middlewares/auth');

/** Разрешенные домены. */
const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://movies-ex.orlov.nomoredomains.icu',
  'http://movies-ex.orlov.nomoredomains.icu',
];

const { PORT = 4000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Логгирование запросов.
app.use(requestLogger);

/** Обработка CORS запросов */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return;
  }
  next();
});

app.use(require('./routes/beforeAuth'));

app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

/** обработка ошибки несуществующего адреса */
app.use((req, res, next) => {
  const err = new NotFoundError('Страница не найдена.');
  next(err);
});

/** логгирование ошибок */
app.use(errorLogger);

/** обрабока ошибок celebrate */
app.use(errors());

/** Централизованный обработчик ошибок */
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
  });

  await app.listen(PORT);

  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
}

main();
