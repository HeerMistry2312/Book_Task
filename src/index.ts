import express from "express";
import {Database} from "./config/imports";
import session from 'express-session';
import { SECRET_KEY } from "../src/config/imports";
import { UserRoute,AdminRoute, AuthorRoute,BookRoute,CartRoute } from "./routes/imports";
import { errorHandlerMiddleware } from "./middleware/imports";
import { AppError } from "./utils/imports";
import StatusConstants from "./constant/status.constant";
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
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        this.app.use(session({
            secret: SECRET_KEY,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
                secure: false,
                httpOnly: true,
            }
        }));
        this.app.use(errorHandlerMiddleware)
    }
    private connectDB(): void {
        new Database();
    }
    private routes(): void {
        const userRoute = new UserRoute().getRoute()
        const adminRoute = new AdminRoute().getRoute()
        const authorRoute = new AuthorRoute().getRoute()
        const bookRoute = new BookRoute().getRoute()
        const cartRoute = new CartRoute().getRoute()
        this.app.use('/', userRoute)
        this.app.use('/admin', adminRoute)
        this.app.use('/author', authorRoute)
        this.app.use('/book', bookRoute)
        this.app.use('/cart', cartRoute)
    }
    public start(port: string | undefined): void {
        this.app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
}