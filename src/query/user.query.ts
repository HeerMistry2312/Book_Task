import {User} from "../model/imports";
import { AppError } from "../utils/imports";
import StatusConstants from '../constant/status.constant';

export default class UserPipeline{
  public static async userPipeline(id:number):Promise<object>{
    try {
      const user = await User.findByPk(id, {
        attributes: ['username', 'email', 'role', 'isApproved', 'token'],
      });

      if (!user) {
        throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
      }
      return user
    } catch (error:any) {
      throw error
    }
  }
}

