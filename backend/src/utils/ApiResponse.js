
class ApiResponse {
  constructor(
    statusCode = 200,
    data = null,
    message = 'Success',
    meta = null
  ) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;

    if (meta) {
      this.meta = meta;
    }
  }

  static success(data = null, message = 'Success', meta = null) {
    return new ApiResponse(200, data, message, meta);
  }

  static created(data = null, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = 'Operation completed successfully') {
    return new ApiResponse(200, null, message);
  }
}

export default ApiResponse;
