import axios from 'axios';

const API_BASE_URL = 'http://localhost:5144/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('parking_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global response handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('parking_token');
      // If we are not on login page, redirect
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
  entryTime: string;
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

// --- API Service Methods ---

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponseDto<AuthResponseDto>> => {
    const response = await apiClient.post<ApiResponseDto<AuthResponseDto>>('/Auth/login', { email, password });
    return response.data;
  },
  getMe: async (): Promise<ApiResponseDto<UserDto>> => {
    const response = await apiClient.get<ApiResponseDto<UserDto>>('/Auth/me');
    return response.data;
  },
};

export const parkingApi = {
  getAll: async (): Promise<ApiResponseDto<ParkingRecordDto[]>> => {
    const response = await apiClient.get<ApiResponseDto<ParkingRecordDto[]>>('/ParkingRecords');
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponseDto<ParkingRecordDto>> => {
    const response = await apiClient.get<ApiResponseDto<ParkingRecordDto>>(`/ParkingRecords/${id}`);
    return response.data;
  },
  create: async (data: CreateParkingRecordDto): Promise<ApiResponseDto<ParkingRecordDto>> => {
    const response = await apiClient.post<ApiResponseDto<ParkingRecordDto>>('/ParkingRecords', data);
    return response.data;
  },
  update: async (id: string, data: UpdateParkingRecordDto): Promise<ApiResponseDto<ParkingRecordDto>> => {
    const response = await apiClient.put<ApiResponseDto<ParkingRecordDto>>(`/ParkingRecords/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponseDto<boolean>> => {
    const response = await apiClient.delete<ApiResponseDto<boolean>>(`/ParkingRecords/${id}`);
    return response.data;
  },
};
