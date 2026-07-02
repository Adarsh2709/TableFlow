import { createTable, findAllTables, findTableById, updateTableById, deleteTableById } from '../repositories/table.repository.js';
import ApiError from '../utils/ApiError.js';

export const addTable = async (tableData) => {
  // Catch unique constraint errors gracefully in error middleware
  return await createTable(tableData);
};

export const getTables = async (filter = {}) => {
  return await findAllTables(filter);
};

export const updateTable = async (id, updateData) => {
  const table = await updateTableById(id, updateData);
  if (!table) {
    throw new ApiError(404, 'Table not found');
  }
  return table;
};

export const deleteTable = async (id) => {
  const table = await deleteTableById(id);
  if (!table) {
    throw new ApiError(404, 'Table not found');
  }
  return table;
};
