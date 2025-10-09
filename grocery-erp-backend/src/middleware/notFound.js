const AppError = require('../utils/appError');

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    console.warn(`404 - Route not found: ${req.originalUrl}`);
  }
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};









