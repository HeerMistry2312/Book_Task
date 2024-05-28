import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { UserService } from "../service/imports";
import { StatusCode } from "../enum/imports";
import { AppError } from "../utils/imports";
import { userValidation } from "../validation/imports";
import StatusConstants from "../constant/status.constant";
export class UserControl {
  public static async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const validatedData = await userValidation.validateUser(req.body);
      const { username, password, email, role } = validatedData;
      let newUser = await UserService.signUp(username, password, email, role);

      await session.commitTransaction();

      res.status(StatusCode.OK).send(newUser);

      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const validatedData = await userValidation.validateLogin(req.body);
      const { username, password } = validatedData;
      let user = await UserService.login(username, password);
      const sessionUser = req.session as unknown as { user: any };
      if (user) {
        sessionUser.user = user;
        await session.commitTransaction();
        res.status(StatusCode.OK).send(user);
        await session.endSession();
      } else {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(
          StatusConstants.INVALID_DATA.body.message,
          StatusConstants.INVALID_DATA.httpStatusCode
        );
      }
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id: Types.ObjectId | undefined = req.id;
      await UserService.logout(id);
      req.session.destroy(async (err) => {
        if (err) {
          await session.abortTransaction();
          await session.endSession();
          throw new AppError(
            StatusConstants.INVALID_DATA.body.message,
            StatusConstants.INVALID_DATA.httpStatusCode
          );
        }
        await session.commitTransaction();
        res.status(StatusCode.OK).json({ message: "Logout successful" });
        await session.endSession();
      });
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async editAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id: Types.ObjectId | undefined = req.id;
      const validatedData = await userValidation.validateEditUser(req.body);
      const { username, email } = validatedData;
      let newUser = await UserService.editAccount(id, username, email);
      await session.commitTransaction();
      res.status(StatusCode.OK).json(newUser);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async deleteAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id: Types.ObjectId | undefined = req.id;
      let deletedAccount = await UserService.deleteAccount(id);
      if (!deletedAccount) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      await session.commitTransaction();
      res.status(StatusCode.OK).json(deletedAccount);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}
