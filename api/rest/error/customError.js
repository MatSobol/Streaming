class CustomError extends Error {
  statusCode;
  message;
  constructor(name, statusCode, message) {
    super();
    this.name = name;
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = {
  CustomError,
};
