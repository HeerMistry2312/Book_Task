import { Types } from 'mongoose';

declare module 'express' {
    interface Request {
        id?: number;
        role?: string;
    }
}
