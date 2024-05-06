import express from "express";
import Database from "./config/db";
import session from 'express-session';
import { SECRET_KEY } from "../src/config/config";
import { UserRoute } from "./routes/userRoute";
import { AdminRoute } from "./routes/adminRoute";
import { AuthorRoute } from "./routes/authorRoute";
import { BookRoute } from "./routes/bookRoute";
export class App {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.connectDB();
        this.routes();
    }

    private config(): void {
        this.app.use(express.json());

        if (!SECRET_KEY) {
            console.error('SECRET_KEY is not defined in the environment');
            process.exit(1);
        }
        this.app.use(session({
            secret: SECRET_KEY,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24, // 1 day
                secure: false,
                httpOnly: true,
            }
        }));
    }
    private connectDB(): void {
        new Database();
    }
    private routes(): void {
        const userRoute = new UserRoute().getRoute()
        const adminRoute = new AdminRoute().getRoute()
        const authorRoute = new AuthorRoute().getRoute()
        const bookRoute = new BookRoute().getRoute()
        this.app.use('/', userRoute)
        this.app.use('/admin', adminRoute)
        this.app.use('/author', authorRoute)
        this.app.use('/book', bookRoute)
    }
    public start(port: string | undefined): void {
        this.app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
}