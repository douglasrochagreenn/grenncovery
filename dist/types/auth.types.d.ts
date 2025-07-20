import { Request } from 'express';
export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserResponse {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface ILoginRequest {
    email: string;
    password: string;
}
export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
export interface ILoginResponse {
    success: boolean;
    message: string;
    data: {
        user: IUserResponse;
        token: string;
        expiresIn: string;
    };
}
export interface IRegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: IUserResponse;
        token: string;
        expiresIn: string;
    };
}
export interface IJwtPayload {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
export interface IAuthRequest extends Request {
    user?: IUserResponse;
}
//# sourceMappingURL=auth.types.d.ts.map