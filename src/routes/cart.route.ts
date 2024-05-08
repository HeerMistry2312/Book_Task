import { cartControl } from "../controller/cart.controller";
import express from "express";
import { authentication } from "../middleware/authentication";
export class cartRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/', authentication.authUser, cartControl.goToCart)
        this.router.post('/add', authentication.authUser, cartControl.addToCart)
        this.router.post('/decrement', authentication.authUser, cartControl.decrementBook)
        this.router.post('/remove', authentication.authUser, cartControl.removeBook)
        this.router.get('/empty', authentication.authUser, cartControl.emptyCart)
        this.router.get('/download', authentication.authUser, cartControl.downloadFile)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}