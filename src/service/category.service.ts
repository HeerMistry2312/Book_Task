import Category from '../model/category.model';
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from '../constant/status.constant';
export class CategoryService {
    public static async allCategories(page: number, pageSize: number): Promise<object> {
        const totalCount = await Category.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);
        if (page < 1 || page > totalPages) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const skip = (page - 1) * pageSize;
        let findCategory = await Category.find().skip(skip).limit(pageSize).select('-_id')
        if (!findCategory) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        return {
            categories: findCategory,
            totalCategories: totalCount,
            totalPages: totalPages,
            currentPage: page
        };
    }

    public static async createCategory(category: string): Promise<object> {
        let findcategory = new Category({ name: category })
        let newCategory = await findcategory.save()
        return { message: "Category Added", data: newCategory }
    }

    public static async updateCategory(category: string,categoryName:string): Promise<object> {
        let findcategory = await Category.findOne({name: categoryName})
        if (!findcategory) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const categoryId = findcategory._id;
        let updateCategory = await Category.findByIdAndUpdate(categoryId,{name: category}).select('-_id')
        return { message: "Category Updated", data: updateCategory }
    }

    public static async deleteCategory(category: string,categoryName:string): Promise<object> {
        let findcategory = await Category.findOne({name: categoryName})
        if (!findcategory) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const categoryId = findcategory._id;
        let updateCategory = await Category.findByIdAndDelete(categoryId,{name: category}).select('-_id')
        return { message: "Category Deleted", data: updateCategory }
    }

}