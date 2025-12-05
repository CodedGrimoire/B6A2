// src/users/usersService.ts
import { pool } from '../db';
import { User } from '../types';

export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query('SELECT id, name, email, phone, role FROM users');
  return result.rows;
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const result = await pool.query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateUser = async (
  id: number,
  name?: string,
  email?: string,
  phone?: string,
  role?: string
): Promise<User | undefined> => {
  const updates: string[] = [];
  const values: (string | number)[] = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name);
  }
  if (email !== undefined) {
    updates.push(`email = $${paramIndex++}`);
    values.push(email.toLowerCase());
  }
  if (phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`);
    values.push(phone);
  }
  if (role !== undefined) {
    updates.push(`role = $${paramIndex++}`);
    values.push(role);
  }

  if (updates.length === 0) {
    // If no updates, just return the existing user
    return await getUserById(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, phone, role`,
    values
  );
  return result.rows[0];
};

export const deleteUser = async (id: number): Promise<User | undefined> => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email, phone, role', [id]);
  return result.rows[0];
};
