import Category from '../model/category.model';
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from '../constant/status.constant';
import { CategoryPipelineBuilder } from '../query/category.query';
export class CategoryService {
    public static async allCategories(page: number, pageSize: number,searchQuery?: string, sortBy?: string): Promise<object> {
        if (page <= 0 || !Number.isInteger(page)) {
            throw new AppError(StatusConstants.INVALID_DATA.body.message,StatusConstants.INVALID_DATA.httpStatusCode)
        }

        const allCategories = await CategoryPipelineBuilder.allCategoryPipeline(page,pageSize,searchQuery,sortBy)
            const categories = await Category.aggregate(allCategories);
            const totalCount = await Category.countDocuments();
            const totalPages = Math.ceil(totalCount / pageSize);
            return {
                categories,
                totalCategories: totalCount,
                totalPages,
                currentPage: page
            };
    }



    public static async createCategory(category: string): Promise<object> {
        let findcategory = new Category({ name: category })
        const newCategory = await findcategory.save()
        const allCategories = await CategoryPipelineBuilder.categoryPipeline(newCategory._id)
        const result = await Category.aggregate(allCategories)
        return { message: "Category Added", data: result }
    }



    public static async updateCategory(category: string,categoryName:string): Promise<object> {
        const findCategory = await Category.findOne({name: categoryName})
        if(!findCategory){
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode)
        }
        await Category.findByIdAndUpdate(findCategory._id,{name:category})
        const allCategories = await CategoryPipelineBuilder.categoryPipeline(findCategory._id)
        const result = await Category.aggregate(allCategories)

        return { message: "Category Updated", data: result }
    }




    public static async deleteCategory(category: string,categoryName:string): Promise<object> {
        let findcategory = await Category.findOne({name: categoryName})
        if (!findcategory) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const categoryId = findcategory._id;

        const allCategories = await CategoryPipelineBuilder.categoryPipeline(categoryId)
        const result = await Category.aggregate(allCategories)

    await Category.findByIdAndDelete(categoryId,{name: category})
        return { message: "Category Deleted", data: result }
    }

}