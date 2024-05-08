import { userControl } from "../controller/user.controller";
import express from "express";
import { authentication } from "../middleware/authentication";
export class userRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.post('/signup', userControl.signUp)
        this.router.post('/login', userControl.login)
        this.router.get('/logout', authentication.authUser, userControl.logout)
        this.router.patch('/edit', authentication.authUser, userControl.editAccount)
        this.router.delete('/delete', authentication.authUser, userControl.deleteAccount)

    }

    public getRoute(): express.Router {
        return this.router;
    }
}