const { CustomError } = require("../error/customError.js");

class DatabaseError extends CustomError {
  constructor() {
    super("DatabaseError", 500, "Database not working properly");
  }
}

class NotFoundError extends CustomError {
  constructor() {
    super("NotFoundError", 404, "Element not found");
  }
}

class IncorrectIdFormatError extends CustomError {
  constructor() {
    super("IncorrectIdFormatError", 400, "Given id is not correct");
  }
}

module.exports = {
  DatabaseError,
  NotFoundError,
  IncorrectIdFormatError
}