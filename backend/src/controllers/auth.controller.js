import { registerUser, loginUser, getCurrentUser, googleLogin } from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

export const register = catchAsync(async (req, res) => {
  const user = await registerUser(req.body);
  
  // Generate token using the utility
  const { generateToken } = await import('../utils/jwt.js');
  const token = generateToken(user._id, user.role);
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.status(201).json(new ApiResponse(201, { user, token }, 'User registered successfully'));
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);

  // Set cookie if needed (optional based on front-end)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
});

export const googleAuth = catchAsync(async (req, res) => {
  const { credential, role } = req.body;
  const { user, token } = await googleLogin(credential, role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.status(200).json(new ApiResponse(200, { user, token }, 'Google login successful'));
});

export const logout = catchAsync(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getMe = catchAsync(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  res.status(200).json(new ApiResponse(200, { user }, 'Current user data retrieved'));
});
