
import bcrypt from 'bcrypt';

import { User } from '../types';

import { pool } from '../db';

import jwt from 'jsonwebtoken';



export const signup = async (name: string, email: string, password: string, phone: string, role: string): Promise<User> => 
  
  
  {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try 
  
  
  {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, phone, role]
    );

    return result.rows[0];
  }
  
  
  catch (error: unknown)
  
  {
    
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505' && 'constraint' in error && error.constraint === 'users_email_key') 
      
    {
      throw new Error('Email already exists. Try again with different email or sign in!');
    }
   
    throw error;
  }


};

export const signin = async (email: string, password: string): Promise<{ token: string; user: User }> => 
  
  
  {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) 
    
    
  {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];


  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    
  {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  return { token, user };
};
