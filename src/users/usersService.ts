// src/users/usersService.ts
import { pool } from '../db';

export const getAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email, phone, role FROM users');
  return result.rows;
};

export const getUserById = async (id: number) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateUser = async (id: number, name: string, phone: string, role: string) => {
  const result = await pool.query(
    'UPDATE users SET name = $1, phone = $2, role = $3 WHERE id = $4 RETURNING *',
    [name, phone, role, id]
  );
  return result.rows[0];
};

export const deleteUser = async (id: number) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
