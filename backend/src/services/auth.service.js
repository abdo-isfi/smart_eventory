const httpStatus = require('http-status');
const userService = require('./user.service');
const { ApiError } = require('../utils/ApiError');

const registerUser = async (userBody) => {
  if (await userService.getUserByEmail(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await userService.createUser(userBody);
  return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
};