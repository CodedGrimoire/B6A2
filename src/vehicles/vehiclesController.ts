// src/vehicles/vehiclesController.ts
import { Request, Response } from 'express';
import * as vehiclesService from './vehiclesService';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehiclesService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};
export const getVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehiclesService.getVehicleById(Number(req.params.id));
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};
export const addVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    const vehicle = await vehiclesService.addVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status);
    res.status(201).json(vehicle);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle_name, daily_rent_price, availability_status } = req.body;
    const vehicle = await vehiclesService.updateVehicle(Number(req.params.id), vehicle_name, daily_rent_price, availability_status);
    res.status(200).json(vehicle);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehiclesService.deleteVehicle(Number(req.params.id));
    res.status(200).json(vehicle);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};
