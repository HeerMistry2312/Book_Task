import { AdminControl } from '../controller/admin.controller';
import express from "express";
import { Authentication } from "../middleware/authentication";
import { CategoryControl } from '../controller/category.controller';
export class AdminRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.put('/approve-author/:id', Authentication.authUser,Authentication.authAdmin, AdminControl.approveAuthor)
        this.router.put('/approve-admin/:id', Authentication.authUser,Authentication.authAdmin, AdminControl.approveAdmin)
        this.router.post('/addBook', Authentication.authUser,Authentication.authAdmin, AdminControl.createBook)
        this.router.patch('/updateBook/:id', Authentication.authUser,Authentication.authAdmin, AdminControl.updateBook)
        this.router.delete('/deleteBook/:id', Authentication.authUser,Authentication.authAdmin, AdminControl.deleteBook)
        this.router.get('/pending', Authentication.authUser,Authentication.authAdmin, AdminControl.listofPendingReq)


        this.router.get('/category', Authentication.authUser,Authentication.authAdmin, CategoryControl.showCategories)
        this.router.post('/addcategory', Authentication.authUser,Authentication.authAdmin, CategoryControl.createCategory)
        this.router.post('/editcategory/:category', Authentication.authUser,Authentication.authAdmin, CategoryControl.updateCategory)
        this.router.post('/deletecategory/:category', Authentication.authUser,Authentication.authAdmin, CategoryControl.deleteCategory)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}