import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const SECRET_KEY = process.env.SECRET_KEY;
export const DB_NAME = process.env.DB_NAME;
export const NAME = process.env.NAME;
export const PASSWORD = process.env.PASSWORD;
export const HOST = process.env.HOST;