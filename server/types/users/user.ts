export interface UserResponseData {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface RegisterUserResponse {
  data: UserResponseData;
  message: string;
}

export interface CurrentUserResponse {
  data: UserResponseData;
  message: string;
}

export interface LoginUserResponseData {
  accessToken: string;
}

export interface LoginUserResponse {
  data: LoginUserResponseData;
  message: string;
}
