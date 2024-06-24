import { UserDescriptionResponse } from "../../Infrastructure/DTOs/Users/Responses/UserDescriptionResponse";

export interface IUserService {
  GetUserById(userId: number): Promise<UserDescriptionResponse>
}

export const UserServiceSymbol = "IUserService";
