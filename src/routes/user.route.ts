import { userControl } from "../controller/user.controller";
import express from "express";
import { Authentication } from "../middleware/authentication";
export class UserRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.post('/signup', userControl.signUp)
        this.router.post('/login', userControl.Login)
        this.router.get('/logout', Authentication.authUser, userControl.logout)
        this.router.patch('/edit', Authentication.authUser, userControl.editAccount)
        this.router.delete('/delete', Authentication.authUser, userControl.deleteAccount)

    }

    public getRoute(): express.Router {
        return this.router;
    }
}