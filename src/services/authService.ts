import { LoginFormData, SignupFormData } from '@/schemas/authSchemas';
import { User, AuthResponse } from '@/stores/authStore';
import { API_BASE_URL } from '../constants';

export interface LoginResponse {
    user: User;
    token: string;
    message?: string;
}

export interface ApiError {
    message: string;
    status?: number;
}

export const authService = {
    async login(credentials: LoginFormData): Promise<LoginResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: AuthResponse = await response.json();

            // Extract user and token from the response structure
            if (
                data.status !== 'success' ||
                !data.data ||
                data.data.length === 0
            ) {
                throw new Error('Invalid response format from server');
            }

            const { user, token } = data.data[0];

            return {
                user,
                token,
                message: 'Login successful',
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An unexpected error occurred during login');
        }
    },

    async signup(userData: SignupFormData): Promise<LoginResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: AuthResponse = await response.json();

            // Extract user and token from the response structure
            if (
                data.status !== 'success' ||
                !data.data ||
                data.data.length === 0
            ) {
                throw new Error('Invalid response format from server');
            }

            const { user, token } = data.data[0];

            return {
                user,
                token,
                message: 'Account created successfully',
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An unexpected error occurred during signup');
        }
    },
};
