// src/config/api.endpoints.ts

/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions
 */

export const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        LOGIN: '/realms/deliverex/protocol/openid-connect/token',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        VERIFY_RESET_OTP: '/api/auth/verify-reset-otp',
        RESET_PASSWORD: '/api/auth/reset-password',
        REFRESH_TOKEN: '/api/auth/refresh-token',
        LOGOUT: '/api/auth/logout',
    },

    // Driver registration endpoints
    DRIVER_REGISTRATION: {
        SUBMIT_APPLICATION: '/api/application/driver/apply',
        GET_DOCUMENT_TYPES: '/api/application/driver/apply',
        UPLOAD_DOCUMENT: (tag: string) => `/api/driver-documents/upload/${tag}`,
    },

    // Driver profile endpoints
    DRIVER_PROFILE: {
        GET_PROFILE: '/api/profile',
        UPDATE_PROFILE: '/api/profile/update',
    },

    // File upload endpoints
    FILES: {
        UPLOAD: '/api/files/upload',
        GET_FILE: (fileName: string) => `/api/files/${fileName}`,
    },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;