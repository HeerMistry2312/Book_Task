import { AuthorControl } from '../controller/author.controller';
import express from "express";
import { Authentication } from "../middleware/authentication";
export class AuthorRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.post('/addBook', Authentication.authUser,Authentication.authAuthor, AuthorControl.createBook)
        this.router.put('/updateBook/:id', Authentication.authUser,Authentication.authAuthor, AuthorControl.updateBook)
        this.router.delete('/deleteBook/:id', Authentication.authUser,Authentication.authAuthor, AuthorControl.deleteBook)
        this.router.get('/myBooks', Authentication.authUser,Authentication.authAuthor, AuthorControl.showMyBooks)
        this.router.get('/myBook/:name', Authentication.authUser,Authentication.authAuthor, AuthorControl.showBook)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}