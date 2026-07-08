// --- DTO interfaces matching Backend ---

export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  roles: string[];
}

export interface AuthResponseDto {
  token: string;
  expiration: string;
  user: UserDto;
}

export interface ParkingRecordDto {
  id: string;
  motorcycleLicensePlate: string;
  motorcycleBrandName: string | null;
  entryTime: string;
  exitTime: string | null;
  estimatedFee: number;
  isNeedWashing: boolean;
  notes?: string;
}

export interface CreateParkingRecordDto {
  motorcycleLicensePlate: string;
  isNeedWashing: boolean;
  notes?: string;
}

export interface UpdateParkingRecordDto {
  motorcycleLicensePlate: string;
  entryTime: string;
  exitTime: string | null;
  estimatedFee: number;
  isNeedWashing: boolean;
  notes?: string;
}