import { LoginForm } from '../types/auth';
import http from '../utils/http';

export function Login(data: LoginForm) {
  return http.post('/auth/login', data);
}
