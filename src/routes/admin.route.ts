import { adminControl } from '../controller/admin.controller';
import express from "express";
import { authentication } from "../middleware/authentication";
import { categoryControl } from '../controller/category.controller';
export class adminRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.patch('/approve-author/:id', authentication.authAdmin, adminControl.approveAuthor)
        this.router.patch('/approve-admin/:id', authentication.authAdmin, adminControl.approveAdmin)
        this.router.post('/addBook', authentication.authAdmin, adminControl.createBook)
        this.router.patch('/updateBook/:id', authentication.authAdmin, adminControl.updateBook)
        this.router.delete('/deleteBook/:id', authentication.authAdmin, adminControl.deleteBook)
        this.router.get('/pending', authentication.authAdmin, adminControl.listofPendingReq)


        this.router.get('/category', authentication.authAdmin, categoryControl.showCategories)
        this.router.post('/addcat', authentication.authAdmin, categoryControl.createCategory)
        this.router.post('/editcat', authentication.authAdmin, categoryControl.updateCategory)
        this.router.post('/deletecat', authentication.authAdmin, categoryControl.deleteCategory)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}