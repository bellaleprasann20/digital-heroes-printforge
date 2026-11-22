
export const notFoundHandler = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode < 600
      ? error.statusCode
      : 500;

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && isProduction
        ? 'Internal server error.'
        : error.message || 'Something went wrong.',
    ...(isProduction
      ? {}
      : {
          stack: error.stack
        })
  });
};

export default errorHandler;
