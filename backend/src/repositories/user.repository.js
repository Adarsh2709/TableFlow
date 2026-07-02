import User from '../models/User.js';

export const createUser = async (userData, session = null) => {
  const options = session ? { session } : {};
  const user = new User(userData);
  return await user.save(options);
};

export const findUserByEmail = async (email, includePassword = false) => {
  const query = User.findOne({ email });
  if (includePassword) {
    query.select('+password');
  }
  return await query.exec();
};

export const findUserById = async (id) => {
  return await User.findById(id).select('-password');
};

export const countUsers = async (query = {}) => {
  return await User.countDocuments(query);
};
