import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

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
    throw new ApiError(404, 'Customer not found');
  }
  
  res.status(200).json(new ApiResponse(200, { customer }, 'Customer retrieved successfully'));
});
