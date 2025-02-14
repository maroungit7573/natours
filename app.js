const path = require('path');
const express = require('express');
const morgan = require('morgan');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');

const app = express();
//wfwf
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//  global middlewares
app.use(express.static(path.join(__dirname, 'public')));

//security header http
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'to many request , try again in an hour',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // middleware that modify the data ( in middle between get and post)

app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
    },
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // ✅ Allow eval()
        connectSrc: ["'self'", 'ws://127.0.0.1:*'], // ✅ Allow WebSocket connection
      },
    },
  }),
);

// data sanitization  , against nosql query injection
app.use(mongoSanitize());
// data sanitization against XSS
app.use(xssClean());

//preventing parameter population
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
