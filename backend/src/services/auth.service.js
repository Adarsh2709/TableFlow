import { createUser, findUserByEmail, findUserById } from '../repositories/user.repository.js';
import { generateToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/env.js';

const googleClient = new OAuth2Client("578661303068-k9tlf9vrqf1kodjcgi25rre3prp25uh4.apps.googleusercontent.com");

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

  // If user signed up with Google and has no password
  if (!user.password) {
    throw new ApiError(401, 'Please sign in with Google');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id, user.role);
  
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

export const googleLogin = async (credential, requestedRole = 'customer') => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: "578661303068-k9tlf9vrqf1kodjcgi25rre3prp25uh4.apps.googleusercontent.com",
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      throw new ApiError(401, 'Invalid Google token');
    }

    const { sub: googleId, email, name } = payload;
    
    let user = await findUserByEmail(email);
    
    if (!user) {
      // Create new user if doesn't exist
      user = await createUser({
        name,
        email,
        googleId,
        role: requestedRole
      });
    } else if (!user.googleId) {
      // Link Google ID if user exists but hasn't linked
      user.googleId = googleId;
      await user.save();
    }
    
    const token = generateToken(user._id, user.role);
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return { user: userResponse, token };
  } catch (error) {
    console.error('Google Auth Error:', error);
    import('fs').then(fs => fs.appendFileSync('auth_error.log', error.message + '\n' + error.stack + '\n'));
    throw new ApiError(401, 'Google authentication failed: ' + error.message);
  }
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
