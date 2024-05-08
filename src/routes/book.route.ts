import { bookControl } from "../controller/book.controller";
import express from "express";
import { Authentication } from "../middleware/authentication";
export class BookRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/', Authentication.authUser, bookControl.showAllBooks)
        this.router.get('/:name', Authentication.authUser, bookControl.showBook)
        this.router.get('/author/:author', Authentication.authUser, bookControl.showByAuthor)
        this.router.get('/category/:cat', Authentication.authUser, bookControl.showByCategory)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}