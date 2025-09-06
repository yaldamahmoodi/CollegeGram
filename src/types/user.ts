//Register

export interface UserRegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstname?: string;
  lastname?: string;
  biography?: string;
}

export type UserRegisterPayload = Omit<
  UserRegisterFormValues,
  "confirmPassword"
>;

//login
export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export type UserLoginPayload = Omit<LoginFormValues, "rememberMe">;
