
const asyncHandler = (requestHandler) => {
  if (typeof requestHandler !== 'function') {
    throw new TypeError('asyncHandler requires a controller function.');
  }

  return function wrappedHandler(req, res, next) {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
