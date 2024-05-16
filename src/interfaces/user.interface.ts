import { Document, Types } from 'mongoose';
import { Role} from "../enum/imports"
export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string;
    role: Role;
    isApproved: Boolean;
    token?: string
}

export interface TokenPayload {
    id: Types.ObjectId;
    role: string;
}


