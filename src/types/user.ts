export interface UserType {
  userId: number;
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
}

export type GetUserResponseType = Omit<UserType, "userId">;

export type UserDataType = Partial<GetUserResponseType>;

export type loginPayloadType = Pick<UserType, "username" | "password">;

export type RegisterPayloadType = Pick<
  UserType,
  "username" | "email" | "password"
>;
