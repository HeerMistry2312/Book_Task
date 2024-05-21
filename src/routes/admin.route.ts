import { CategoryControl, AdminControl } from '../controller/imports';
import express from "express";
import { Authentication } from "../middleware/imports";

export class AdminRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    private routes(): void {
        this.router.put('/approve-author/:id', Authentication.authUser,Authentication.authAdmin, AdminControl.approveAuthor)
        this.router.put('/approve-admin/:id', Authentication.authUser,Authentication.authAdmin, AdminControl.approveAdmin)
        //this.router.post('/addBook', Authentication.authUser,Authentication.authAdmin, AdminControl.createBook)
        // this.router.put('/updateBook/:id', Authentication.authUser,Authentication.authAdmin, AdminControl.updateBook)
        // this.router.delete('/deleteBook/:id', Authentication.authUser,Authentication.authAdmin, AdminControl.deleteBook)
        this.router.get('/pending', Authentication.authUser,Authentication.authAdmin, AdminControl.listofPendingReq)


        this.router.get('/category', Authentication.authUser,Authentication.authAdmin, CategoryControl.showCategories)
        this.router.post('/addcategory', Authentication.authUser,Authentication.authAdmin, CategoryControl.createCategory)
        this.router.put('/editcategory/:category', Authentication.authUser,Authentication.authAdmin, CategoryControl.updateCategory)
        this.router.delete('/deletecategory/:category', Authentication.authUser,Authentication.authAdmin, CategoryControl.deleteCategory)
    }

    public getRoute(): express.Router {
        return this.router;
    }
}