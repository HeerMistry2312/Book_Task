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
        this.router.post('/addBook', Authentication.authAdmin, adminControl.createBook)
        this.router.patch('/updateBook/:id', Authentication.authAdmin, adminControl.updateBook)
        this.router.delete('/deleteBook/:id', Authentication.authAdmin, adminControl.deleteBook)
        this.router.get('/pending', Authentication.authAdmin, adminControl.listofPendingReq)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}