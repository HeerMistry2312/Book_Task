import { CartControl } from "../controller/imports";
import express from "express";
import { Authentication } from "../middleware/imports";
export class CartRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/', Authentication.authUser, CartControl.goToCart)
        this.router.post('/add', Authentication.authUser, CartControl.addToCart)
        this.router.post('/decrement', Authentication.authUser, CartControl.decrementBook)
        this.router.post('/remove', Authentication.authUser, CartControl.removeBook)
        this.router.get('/empty', Authentication.authUser, CartControl.emptyCart)
        // this.router.get('/download', Authentication.authUser, CartControl.downloadFile)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}