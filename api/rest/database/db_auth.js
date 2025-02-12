const { DatabaseError } = require("./databaseError.js");
const { CustomError } = require("../error/customError.js");

const mongoClient = require("./mongoClient.js");
const argon2 = require("argon2");

const ACCESS_THIRD_PARTY = 0;
const ACCESS_USERS = 1;

const database = mongoClient.getDB();
const accounts = database.collection("accounts");

class IncorrectLoginError extends CustomError {
  constructor() {
    super("IncorrectLoginError", 400, "Login unsuccessful");
  }
}

class IncorrectPasswordError extends CustomError {
  constructor() {
    super("IncorrectPasswordError", 400, "Password is not corrent");
  }
}

class EmailTakenError extends CustomError {
  constructor() {
    super("EmailTakenError", 400, "Email is already taken");
  }
}

const findByEmail = async (email) => {
  const query = { email: { $eq: email } };
  const result = await accounts.findOne(query);
  return result;
};

const register = async (inputEmail, inputPassword, inputUsername) => {
  try {
    const email = inputEmail;
    const password = inputPassword;
    const username = inputUsername;

    const result = await findByEmail(email);
    if (result) {
      throw new EmailTakenError();
    }

    if (!password || password.length < 1) {
      throw new IncorrectPasswordError();
    }

    let hash;

    try {
      hash = await argon2.hash(password);
    } catch {
      throw new IncorrectPasswordError();
    }

    const account = {
      username: username,
      email: email,
      password: hash,
      accessRight: ACCESS_USERS,
    };
    await accounts.insertOne(account);
  } catch (e) {
    if (e?.statusCode) {
      throw e;
    }
    console.log(e);
    throw new DatabaseError();
  }
};

const loginThirdParty = async (inputEmail, inputUsername) => {
  try {
    const email = inputEmail;
    const username = inputUsername;

    const result = await findByEmail(email, username);

    if (result) {
      if (result?.accessRight === ACCESS_THIRD_PARTY) {
        return;
      } else {
        throw new EmailTakenError();
      }
    } else {
      const account = {
        username: username,
        email: email,
        accessRight: ACCESS_THIRD_PARTY,
      };
      await accounts.insertOne(account);
    }
  } catch (e) {
    if (e?.statusCode) {
      throw e;
    }
    console.log(e.name);
    throw new DatabaseError();
  }
};

const login = async (inputEmail, inputPassword) => {
  try {
    const email = inputEmail;
    const password = inputPassword;

    const result = await findByEmail(email);

    if (!result) {
      throw new IncorrectLoginError();
    }
    console.log(result.password);
    if (await argon2.verify(result.password, password)) {
      return result.username;
    }
    throw new IncorrectLoginError();
  } catch (e) {
    if (e?.statusCode) {
      throw e;
    }
    console.log(e);
    throw new DatabaseError();
  }
};

module.exports = {
  register,
  login,
  DatabaseError,
  IncorrectPasswordError,
  IncorrectLoginError,
  EmailTakenError,
  ACCESS_THIRD_PARTY,
  ACCESS_USERS,
  loginThirdParty,
};
