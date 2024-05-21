import { AppError } from "../utils/imports";
import { Role } from "../enum/imports";
import {Category, User} from "../model/imports";
import StatusConstants from "../constant/status.constant";
import { UserPipeline,AdminPipeline} from "../query/imports";
import { Op } from "sequelize";


export class AdminService {
    public static async approveAuthor(name: string): Promise<object> {
        const user = await User.findOne({where:{username:name}});
        if (!user) {
          throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        if (user.role !== Role.Author) {
          throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        const approveAuthor = await user.update({isApproved: true})
        const result = await UserPipeline.userPipeline(approveAuthor.id)
        return { data: result };
      }



      public static async approveAdmin(name: string): Promise<object> {
        const user = await User.findOne({where:{username:name}});
        if (!user) {
          throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        if (user.role !== Role.Author) {
          throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        const approveAdmin = await user.update({isApproved: true})
        const result = await UserPipeline.userPipeline(approveAdmin.id)
        return { data: result };
      }

      public static async listofPendingReq(
        page: number,
        pageSize: number,
        searchQuery?: string,
        sortBy?: string
      ): Promise<object> {

        const user = await AdminPipeline.requestPipeline(page,pageSize,searchQuery,sortBy)
        const totalCount = (await User.findAndCountAll({where: {
            isApproved: false,
            role: {
              [Op.in]: [Role.Admin, Role.Author]
            }
          }})).count
        const totalPages = Math.ceil(totalCount / pageSize);
        return {
         users: user,
          totalUsers: totalCount,
          totalPages: totalPages,
          currentPage: page,
        };
      }

//       public static async createBook(title:string, author:string, isbn:number, categories:string[], description:string, price:number ): Promise<object> {
//         const authid = await User.findOne({where:{ username: author }});
//         if (!authid) {
//           throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
//         }
//         const id: number= authid.id;
//         console.log(title)
//         const book = await Book.create({
//           Bookname:title,
//           author: id,
//           ISBN:isbn,
//           description:description,
//           price:price
//         });

// console.log(book)
//         // const fetchid = await Category.findAll({where:{name:{$in:[...categories]}}})
//         //   const categoriesID = fetchid.map(i => i.id)
//         //   const newCategoriesIds = categoriesID

//         // const bookCategoryEntries = newCategoriesIds.map(categoryId => ({
//         //   bookId: book.id,
//         //   categoryId: categoryId
//         // }));
//         // await BookCategory.bulkCreate(bookCategoryEntries);

//         return { message: "Book Created", data: book };
//       }

}