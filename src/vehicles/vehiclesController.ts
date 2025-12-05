import * as vehiclesService from './vehiclesService';



import { Request, Response, NextFunction } from 'express';




export const getVehicles = async (req: Request, res: Response, next: NextFunction) => 
  
  
  
  {


  try
  
  
  
  {
    const vehicles = await vehiclesService.getAllVehicles();
    res.status(200).json({
      success: true,
      message: vehicles.length > 0 ? 'Vehicles retrieved successfully' : 'No vehicles found',



      data: vehicles,
    });
  } 
  
  
  catch (error) 
  
  
  {
    next(error);


  }


};

export const getVehicle = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try 
  
  
  {
    const vehicle = await vehiclesService.getVehicleById(Number(req.params.vehicleId));
    if (!vehicle)
      
      
      
      {


      return res.status(404).json(
        
        
        
        {
        success: false,
        message: 'Vehicle not found',
        errors: 'Vehicle not found',



      });



    }

    res.status(200).json(
      
      
      {
      success: true,

      message: 'Vehicle retrieved successfully',
      data: vehicle,
    });


  }
  
  
  catch (error) 
  
  
  
  {
    next(error);
  }
};

export const addVehicle = async (req: Request, res: Response, next: NextFunction) =>
  
  
  
  {
  try 
  
  
  
  {
    
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    
    
    const vehicle = await vehiclesService.addVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status);
   
   
    res.status(201).json(
      
      
      {
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    }
  
  );


  } 
  
  
  
  catch (error)
  
  
  {
    next(error);
  }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try 
  
  {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;


    const vehicle = await vehiclesService.updateVehicle(
      Number(req.params.vehicleId),
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    if (!vehicle) 
      
      {
      return res.status(404).json(
        
        
        
        {
        success: false,
        message: 'Vehicle not found',
        errors: 'Vehicle not found',
      });



    }


    res.status(200).json(
      
      
      {
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,


    }
  
  
  
  );
  } catch (error) 
  
  
  
  {
    next(error);
  }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => 
  
  
  {
  try {
    const vehicle = await vehiclesService.deleteVehicle(Number(req.params.vehicleId));
    if (!vehicle) 
      
      
      {
      return res.status(404).json(
        
        
        
        {
        success: false,
        message: 'Vehicle not found',
        errors: 'Vehicle not found',
      }
    
    
    
    );
    }
    res.status(200).json(
      
      
      {
      success: true,



      
      message: 'Vehicle deleted successfully',
    });
  } 
  
  
  
  catch (error) 
  
  
  
  
  {
    next(error);
  }
};
