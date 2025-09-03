export interface MessageResponse {
  message: string;
}

export interface LoginResponse {
  user: {
    user_role: string;
    [key: string]: any;
  };
}
