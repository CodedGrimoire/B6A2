// src/vehicles/vehiclesService.ts
import { pool } from '../db';

export const getAllVehicles = async () => {
  const result = await pool.query('SELECT * FROM vehicles');
  return result.rows;
};

export const getVehicleById = async (id: number) => {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  return result.rows[0];
};

export const addVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string) => {
  const result = await pool.query(
    'INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
  return result.rows[0];
};

export const updateVehicle = async (id: number, vehicle_name: string, daily_rent_price: number, availability_status: string) => {
  const result = await pool.query(
    'UPDATE vehicles SET vehicle_name = $1, daily_rent_price = $2, availability_status = $3 WHERE id = $4 RETURNING *',
    [vehicle_name, daily_rent_price, availability_status, id]
  );
  return result.rows[0];
};

export const deleteVehicle = async (id: number) => {
  const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
