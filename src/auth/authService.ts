// src/auth/authService.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

export const signup = async (name: string, email: string, password: string, phone: string, role: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, phone, role]
    );

    return result.rows[0];
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === '23505' && error.constraint === 'users_email_key') {
      throw new Error('Email already exists. Please use a different email or sign in.');
    }
    // Re-throw other errors
    throw error;
  }
};

export const signin = async (email: string, password: string) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  return { token };
};
