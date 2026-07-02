import { createUser, findUserByEmail, findUserById } from '../repositories/user.repository.js';
import { generateToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';

export const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await createUser(userData);
  user.password = undefined; // Don't return password
  
  return user;
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email, true);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id, user.role);
  
  // Return user without password
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
