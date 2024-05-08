import { authorControl } from '../controller/author.controller';
import express from "express";
import { authentication } from "../middleware/authentication";
export class authorRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.post('/addBook', authentication.authAuthor, authorControl.createBook)
        this.router.patch('/updateBook/:id', authentication.authAuthor, authorControl.updateBook)
        this.router.delete('/deleteBook/:id', authentication.authAuthor, authorControl.deleteBook)
        this.router.get('/myBooks', authentication.authAuthor, authorControl.showMyBooks)
        this.router.get('/myBook/:name', authentication.authAuthor, authorControl.showBook)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}