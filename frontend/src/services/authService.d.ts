import { LoginCredentials, LoginResponse, RegisterData, UserProfile } from './authService';

declare const authService: {
  getInstance(): {
    login(credentials: LoginCredentials): Promise<LoginResponse>;
    register(data: RegisterData): Promise<LoginResponse>;
    getCurrentUser(): Promise<UserProfile>;
    updateProfile(data: Partial<UserProfile>): Promise<UserProfile>;
    changePassword(oldPassword: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    logout(): void;
    isAuthenticated(): boolean;
  };
};

export default authService; 