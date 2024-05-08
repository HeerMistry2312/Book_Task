import { authorControl } from '../controller/author.controller';
import express from "express";
import { Authentication } from "../middleware/authentication";
export class AuthorRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.post('/addBook', Authentication.authAuthor, authorControl.createBook)
        this.router.patch('/updateBook/:id', Authentication.authAuthor, authorControl.updateBook)
        this.router.delete('/deleteBook/:id', Authentication.authAuthor, authorControl.deleteBook)
        this.router.get('/myBooks', Authentication.authAuthor, authorControl.showMyBooks)
        this.router.get('/myBook/:name', Authentication.authAuthor, authorControl.showBook)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}