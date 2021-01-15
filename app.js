const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const globalErrorHandler = require('./controller/errorController');
const categoryRouter = require('./routes/categoryRoutes');
const itemRouter = require('./routes/itemRoutes');

const AppError = require('./utils/appError');

const app = express();

//Handle cors
app.use(cors());
app.options('*', cors());

//Set security HTTP headers
app.use(helmet());

// Logger for Development Environment
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too amny requests from this IP, please try again in an hour',
});

// Rate limiter
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Data sanitize against NoSql query
app.use(mongoSanitize());

//Data sanitization against xss attacks
app.use(xss());

app.use(compression());

app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/items', itemRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
