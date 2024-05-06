import { adminControl } from '../controller/adminControl';
import express from "express";
import { Authentication } from "../middleware/authentication";
export class AdminRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.patch('/approve-author/:id', Authentication.authAdmin, adminControl.approveAuthor)
        this.router.patch('/approve-admin/:id', Authentication.authAdmin, adminControl.approveAdmin)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}