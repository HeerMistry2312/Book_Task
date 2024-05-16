import { UserControl } from "../controller/imports";
import express from "express";
import { Authentication } from "../middleware/imports";
export class UserRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.post('/signup', UserControl.signUp)
        this.router.post('/login', UserControl.login)
        this.router.get('/logout', Authentication.authUser, UserControl.logout)
        this.router.put('/edit', Authentication.authUser, UserControl.editAccount)
        this.router.delete('/delete', Authentication.authUser, UserControl.deleteAccount)

    }

    public getRoute(): express.Router {
        return this.router;
    }
}