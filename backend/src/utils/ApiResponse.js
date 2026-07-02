class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = statusCode < 400;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}

export default ApiResponse;
