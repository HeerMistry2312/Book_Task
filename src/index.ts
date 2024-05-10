import express from "express";
import Database from "./config/db";
import session from 'express-session';
import { SECRET_KEY } from "../src/config/config";
import { UserRoute } from "./routes/user.route";
import { AdminRoute } from "./routes/admin.route";
import { AuthorRoute } from "./routes/author.route";
import { BookRoute } from "./routes/book.route";
import { CartRoute } from "./routes/cart.route";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { AppError } from "./utils/customErrorHandler";
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