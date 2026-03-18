import api from './api';
import { LoginPayload, RegisterPayload, User, AuthTokens } from '@/types';

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const res = await api.post('/auth/login', payload);
    return res.data.data;
  },

  async register(payload: RegisterPayload): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const res = await api.post('/auth/register', payload);
    return res.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data.data;
  },
};
