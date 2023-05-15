import { UserModel } from "./user.model";

export class UserLoggedModel {
  public user: UserModel | undefined;
  public token: string | undefined;
}
