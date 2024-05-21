import { Optional } from "sequelize";
import { Role } from "../enum/imports";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: Role;
  isApproved: boolean;
  token?: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "token" | "role" | "isApproved"> {}

interface TokenPayload {
    id: number;
    role: string;
}


export { UserAttributes, UserCreationAttributes, TokenPayload };
