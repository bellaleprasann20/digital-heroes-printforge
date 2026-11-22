
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      if (!schema || typeof schema.validate !== 'function') {
        throw new Error('A valid validation schema is required.');
      }

      const result = schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params
        },
        {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: false
        }
      );

      if (result.error) {
        return res.status(400).json({
          success: false,
          message: 'Request validation failed.',
          errors: result.error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
      }

      req.validated = result.value;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
