
// Types et utilitaires communs pour l'API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Constantes pour l'API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: '/users/:id',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    PENDING: '/users/pending',
    STATUS: '/users/:id/status',
    FEATURED: '/users/featured',
  },
  LISTINGS: {
    GET_ALL: '/listings',
    GET_BY_ID: '/listings/:id',
    CREATE: '/listings',
    UPDATE: '/listings/:id',
    DELETE: '/listings/:id',
    SEARCH: '/listings/search',
  },
  OFFERS: {
    GET_ALL: '/offers',
    GET_BY_ID: '/offers/:id',
    CREATE: '/offers',
    UPDATE: '/offers/:id',
    DELETE: '/offers/:id',
  },
  NOTIFICATIONS: {
    GET_USER: '/notifications/user',
    CREATE: '/notifications',
    UPDATE: '/notifications/:id',
    DELETE: '/notifications/:id',
    MARK_READ: '/notifications/:id/read',
    UPDATE_STATUS: '/notifications/:id/status',
  },
} as const;

// Fonctions utilitaires pour l'API
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  let url = endpoint;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
};

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

// Types pour les filtres communs
export interface BaseFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UserFilters extends BaseFilters {
  role?: string;
  wilaya?: string;
  isActive?: boolean;
}

export interface ListingFilters extends BaseFilters {
  userId?: string;
  medication?: string;
}

export interface OfferFilters extends BaseFilters {
  userId?: string;
  priceMin?: number;
  priceMax?: number;
  isExpired?: boolean;
}
