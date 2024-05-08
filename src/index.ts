import express from "express";
import database from "./config/db";
import session from 'express-session';
import { SECRET_KEY } from "../src/config/config";
import { userRoute } from "./routes/user.route";
import { adminRoute } from "./routes/admin.route";
import { authorRoute } from "./routes/author.route";
import { bookRoute } from "./routes/book.route";
import { cartRoute } from "./routes/cart.route";
import { appError, errorHandlerMiddleware } from "./error/errorHandler";
export class app {
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
            throw new appError('SECRET_KEY is not defined',404);
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
        new database();
    }
    private routes(): void {
        const user_Route = new userRoute().getRoute()
        const admin_Route = new adminRoute().getRoute()
        const author_Route = new authorRoute().getRoute()
        const book_Route = new bookRoute().getRoute()
        const cart_Route = new cartRoute().getRoute()
        this.app.use('/', user_Route)
        this.app.use('/admin', admin_Route)
        this.app.use('/author', author_Route)
        this.app.use('/book', book_Route)
        this.app.use('/cart', cart_Route)
    }
    public start(port: string | undefined): void {
        this.app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
}