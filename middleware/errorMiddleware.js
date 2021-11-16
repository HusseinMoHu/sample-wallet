const notFound = (req, res, next) => {
  const error = new Error(
    `couldn't find the specified URL: ${req.originalUrl}`
  );
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 400 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
  res.end();
};

module.exports = {
  notFound,
  errorHandler,
};
