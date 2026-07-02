import RestaurantTable from '../models/RestaurantTable.js';

export const createTable = async (tableData, session = null) => {
  const options = session ? { session } : {};
  const table = new RestaurantTable(tableData);
  return await table.save(options);
};

export const findAllTables = async (filter = {}) => {
  return await RestaurantTable.find(filter).sort({ tableNumber: 1 });
};

export const findTableById = async (id) => {
  return await RestaurantTable.findById(id);
};

export const updateTableById = async (id, updateData, session = null) => {
  const options = { new: true, runValidators: true };
  if (session) options.session = session;
  return await RestaurantTable.findByIdAndUpdate(id, updateData, options);
};

export const deleteTableById = async (id, session = null) => {
  const options = session ? { session } : {};
  return await RestaurantTable.findByIdAndDelete(id, options);
};

export const findTablesByMinimumCapacity = async (guests, session = null) => {
  // Finds active tables with capacity >= guests, sorted by capacity ascending
  const query = RestaurantTable.find({ isActive: true, capacity: { $gte: guests } }).sort({ capacity: 1 });
  if (session) {
    query.session(session);
  }
  return await query.exec();
};
