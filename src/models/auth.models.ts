export interface UserAuth {
  id: string;
  email: string;
  token: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserAuth | null;
  isAuthenticated: boolean;
}
