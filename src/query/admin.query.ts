import { Role } from "../enum/imports";
import {User} from "../model/imports";
import { Op, where } from "sequelize";

export default class AdminPipeline{
  public static async requestPipeline(page: number, pageSize: number,searchQuery?: string, sortBy?: string):Promise<object>{
    try {
      let queryOptions: any = {
        offset: (page - 1) * pageSize,
        limit: pageSize,
        attributes: ['username', 'email', 'role', 'isApproved'],
        where: {
          isApproved: false,
          role: {
            [Op.in]: [Role.Admin, Role.Author]
          }
        },
      };
        if (searchQuery) {
          queryOptions.where = {
            ...queryOptions.where,
            [Op.or]: [
              { username: { [Op.iLike]: `%${searchQuery}%` } },
              { email: { [Op.iLike]: `%${searchQuery}%` } },
            ],
          };
        }
        if (sortBy) {
            const orderDirection = sortBy.startsWith('-') ? 'DESC' : 'ASC';
            const attributeName = sortBy.replace(/^-/, '');
            queryOptions.order = [[attributeName, orderDirection]];
        }
        const pendingRequests = await User.findAll(queryOptions);
        console.log(pendingRequests)
        return pendingRequests;
    } catch (error:any) {
      throw error
    }
  }
}

