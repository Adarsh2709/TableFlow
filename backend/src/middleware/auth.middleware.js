import { verifyToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';

export const authenticate = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // If using cookies
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, please login'));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new ApiError(401, 'Not authorized, token failed or expired'));
  }

  req.user = decoded; // Contains id and role
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action')
      );
    }
    next();
  };
};
