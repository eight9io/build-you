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


export interface ILoginResponse {
  authorization: string;
  refresh: string;
}

export interface IToken {
  id: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export interface ISocialLoginForm {
  token: string;

  // For apple login
  email?: string;
  sub?: string;
}
