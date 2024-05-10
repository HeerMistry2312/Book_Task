import { Types } from 'mongoose';

declare module 'express' {
    interface Request {
        id?: Types.ObjectId;
        role?: string;
    }
}
