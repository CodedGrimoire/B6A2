// src/users/usersController.ts
import { Request, Response } from 'express';
import * as usersService from './usersService';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await usersService.getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, role } = req.body;
    const user = await usersService.updateUser(Number(req.params.id), name, phone, role);
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await usersService.deleteUser(Number(req.params.id));
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
};
