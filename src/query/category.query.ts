import {Category} from "../model/imports";
import { AppError } from "../utils/imports";
import StatusConstants from '../constant/status.constant';
import { Op } from "sequelize";

export default class CategoryPipeline{
    public static async CategoryPipeline(page: number, pageSize: number,searchQuery?: string, sortBy?: string):Promise<object>{
      try {
        let queryOptions: any = {
            offset: (page - 1) * pageSize,
            limit: pageSize,
            attributes: ['name'],
        };
        if (searchQuery) {
            queryOptions.where = {
                name: {
                    [Op.iLike]: `%${searchQuery}%`,
                },
            };
        }
        if (sortBy) {
            const orderDirection = sortBy.startsWith('-') ? 'DESC' : 'ASC';
            const attributeName = sortBy.replace(/^-/, '');
            queryOptions.order = [[attributeName, orderDirection]];
        }
        const categories = await Category.findAll(queryOptions);

        return categories;
      } catch (error:any) {
        throw error
      }
    }


    public static async findCategoryPipeline(id:number):Promise<object>{
        try {
            const category = await Category.findByPk(id, {
                attributes: ['name'],
              });

              if (!category) {
                throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
              }
              return category
        } catch (error) {
            throw error
        }
    }
  }
