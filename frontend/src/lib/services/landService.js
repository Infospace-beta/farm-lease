import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

const landService = {
  // Get all lands
  getAllLands: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.LANDS, { params });
    return response.data;
  },

  // Get single land
  getLandById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.LAND_DETAIL(id));
    return response.data;
  },

  // Get user's lands (for owners)
  getMyLands: async () => {
    const response = await apiClient.get(API_ENDPOINTS.MY_LANDS);
    return response.data;
  },

  // Create new land listing
  createLand: async (landData) => {
    const response = await apiClient.post(API_ENDPOINTS.LANDS, landData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update land
  updateLand: async (id, landData) => {
    const response = await apiClient.put(API_ENDPOINTS.LAND_DETAIL(id), landData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete land
  deleteLand: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.LAND_DETAIL(id));
    return response.data;
  },

  // Get pending lands (for admin)
  getPendingLands: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PENDING_LANDS);
    return response.data;
  },

  // Verify land (for admin)
  verifyLand: async (id, verificationData) => {
    const response = await apiClient.post(API_ENDPOINTS.VERIFY_LAND(id), verificationData);
    return response.data;
  },

  // Search lands
  searchLands: async (searchParams) => {
    const response = await apiClient.get(API_ENDPOINTS.LANDS, {
      params: searchParams,
    });
    return response.data;
  },
};

export default landService;
