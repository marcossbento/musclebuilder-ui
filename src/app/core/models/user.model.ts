export interface User {
    id: number;
    name: string;
    email: string;
    height?: string;
    weight?: string;
    goal?: string;
}

export interface UserRegistration {
    name: string;
    email: string;
    password: string;
    height?: string;
    weight?: string;
    goal?: string;
}

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface LoginResponse {
    token: string;
}

export interface PasswordUpdate {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface EmailUpdate {
    newEmail: string;
    currentPassword: string;
}