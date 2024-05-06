import { Request, Response } from "express";
import { AdminService } from "../service/adminService";
import { Types } from "mongoose";
import { AuthReq } from "../middleware/authentication";

export class adminControl {
    public static async approveAuthor(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            let user = await AdminService.ApproveAuthor(id)
            res.status(200).send({ message: "Author Approved Successfully" })
        } catch (error) {
            res.send({ messgae: error })
        }
    }


    public static async approveAdmin(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            let user = await AdminService.ApproveAdmin(id)
            res.status(200).send({ message: "Admin Approved Successfully" })
        } catch (error) {
            res.send({ messgae: error })
        }
    }
}