import { BookControl } from "../controller/book.controller";
import express from "express";
import { Authentication } from "../middleware/authentication";
export class BookRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/', Authentication.authUser, BookControl.showAllBooks)
        this.router.get('/:name', Authentication.authUser, BookControl.showBook)
        this.router.get('/author/:author', Authentication.authUser, BookControl.showByAuthor)
        this.router.get('/category/:cat', Authentication.authUser, BookControl.showByCategory)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}