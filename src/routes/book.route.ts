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
    }

    public getRoute(): express.Router {
        return this.router;
    }
}