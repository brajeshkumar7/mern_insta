export interface User {
  _id: string | null;
  name: string | null;
  email: string | null;
  roles: number[];
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}
