import type { ApiResponseDto, AuthResponseDto, CreateParkingRecordDto, ParkingRecordDto, UpdateParkingRecordDto, UserDto } from '@/types';
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
