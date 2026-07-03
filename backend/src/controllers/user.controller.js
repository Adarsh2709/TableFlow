import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import AppError from '../utils/AppError.js';

export const getAllCustomers = catchAsync(async (req, res) => {
  const customers = await User.find({ role: 'customer' })
    .select('-password')
    .sort({ createdAt: -1 });
    
  res.status(200).json(new ApiResponse(200, { customers }, 'Customers retrieved successfully'));
});

export const getCustomerById = catchAsync(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' })
    .select('-password');
    
  if (!customer) {
    throw new AppError('Customer not found', 404);
  }
  
  res.status(200).json(new ApiResponse(200, { customer }, 'Customer retrieved successfully'));
});
