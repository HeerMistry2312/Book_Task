import { bookControl } from "../controller/book.controller";
import express from "express";
import { authentication } from "../middleware/authentication";
export class bookRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/', authentication.authUser, bookControl.showAllBooks)
        this.router.get('/:name', authentication.authUser, bookControl.showBook)
        this.router.get('/author/:author', authentication.authUser, bookControl.showByAuthor)
        this.router.get('/category/:cat', authentication.authUser, bookControl.showByCategory)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}