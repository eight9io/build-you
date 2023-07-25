
export interface LoginForm {
  user: string;
  password: string;
}
export interface RegisterForm {
  email: string;
  password: string;
}
export interface ForgotPasswordForm {
  email: string;
}
export interface ChangePasswordForm {
  code: string;
  email: string;
  password: string;
}
export interface IOccupation {
  id: string;
  name: string;
}

export interface ILoginResponse {
  authorization: string;
  refresh: string;
}

export interface IToken {
  exp: number;
  iat: number;
  sub: string;
}

export interface ISocialLoginForm {
  token: string;
}