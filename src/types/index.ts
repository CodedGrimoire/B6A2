


export interface User 


{
  id: number;
 
  phone: string;
  role: 'admin' | 'customer';

  name: string;
  email: string;
  
  password?: string;
}

export interface UserPayload {
  userId: number;
  role: 'admin' | 'customer';
}




export interface Booking 

{
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;

  rent_end_date: string;
  total_price: number;
  status: 'active' | 'cancelled' | 'returned';
}



export interface BookingWithRelations extends Booking 


{
  customer?: 
  
  
  {
    name: string;
    email: string;
  };


  vehicle?: 
  
  {
    vehicle_name: string;
    registration_number: string;
    type?: string;
    daily_rent_price?: number;
    availability_status?: string;
  };
}



export interface SignupRequest 

{
  name: string;
  email: string;
  password: string;


  phone: string;
  role: 'admin' | 'customer';
}




export interface CreateVehicleRequest 


{
  vehicle_name: string;

  type: 'car' | 'bike' | 'van' | 'SUV';
  registration_number: string;


  daily_rent_price: number;
  availability_status: 'available' | 'booked';
}



export interface UpdateUserRequest 

{
  name?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'customer';
}

export interface CreateBookingRequest 


{
  customer_id: number;
  rent_end_date: string;
  vehicle_id: number;


  rent_start_date: string;
 
}

export interface UpdateBookingRequest 

{
  status: 'cancelled' | 'returned';
}


export interface SigninRequest 


{
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string;
}



export interface UpdateVehicleRequest 


{
  vehicle_name?: string;
  type?: 'car' | 'bike' | 'van' | 'SUV';
  registration_number?: string;


  daily_rent_price?: number;
  availability_status?: 'available' | 'booked';
}


export interface Vehicle 

{
  id: number;
  vehicle_name: string;
 
  registration_number: string;
  daily_rent_price: number;

  type: 'car' | 'bike' | 'van' | 'SUV';
  availability_status: 'available' | 'booked';
}