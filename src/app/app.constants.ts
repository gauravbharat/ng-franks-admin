export enum AuthType {
  UPDATE_USER = 'UPDATE_USER',
  RESET_USER = 'RESET_USER',
}

export interface AuthData {
  username?: string;
  email?: string;
  password: string;
}
