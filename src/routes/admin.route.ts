import { adminControl } from '../controller/admin.controller';
import express from "express";
import { Authentication } from "../middleware/authentication";
import { categoryControl } from '../controller/category.controller';
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


        this.router.get('/category', Authentication.authAdmin, categoryControl.showCategories)
        this.router.post('/addcat', Authentication.authAdmin, categoryControl.createCategory)
        this.router.post('/editcat', Authentication.authAdmin, categoryControl.updateCategory)
        this.router.post('/deletecat', Authentication.authAdmin, categoryControl.deleteCategory)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}