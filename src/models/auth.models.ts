export interface UserAuth {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserAuth | null;
  isAuthenticated: boolean;
}
