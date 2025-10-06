import axios from 'axios';
import { useAuthStore } from './store';
import toast from 'react-hot-toast';

// Configuration de base d'Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expiré ou invalide
      useAuthStore.getState().logout();
      toast.error('Session expirée. Veuillez vous reconnecter.');
      window.location.href = '/login';
    } else if (response?.status === 403) {
      toast.error('Accès non autorisé');
    } else if (response?.status >= 500) {
      toast.error('Erreur serveur. Veuillez réessayer plus tard.');
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else {
      toast.error('Une erreur est survenue');
    }
    
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  verifyToken: () => api.get('/auth/verify')
};

// Services des documents
export const documentsAPI = {
  getAll: (params = {}) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  download: (id) => api.get(`/documents/${id}/download`, {
    responseType: 'blob'
  })
};

// Services de l'IA
export const aiAPI = {
  generateContent: (data) => api.post('/ai/generate', data),
  correctText: (data) => api.post('/ai/correct', data),
  summarizeText: (data) => api.post('/ai/summarize', data),
  generatePresentation: (data) => api.post('/ai/presentation', data),
  generateFormula: (data) => api.post('/ai/formula', data),
  getContextualHelp: (data) => api.post('/ai/help', data),
  chatWithAssistant: (data) => api.post('/ai/chat', data)
};

// Service de santé
export const healthAPI = {
  check: () => api.get('/health')
};

// Utilitaires
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    }
  });
};

export const downloadFile = async (documentId, fileName) => {
  try {
    const response = await documentsAPI.download(documentId);
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success('Fichier téléchargé avec succès');
  } catch (error) {
    console.error('Erreur de téléchargement:', error);
    toast.error('Erreur lors du téléchargement');
  }
};

export default api;
