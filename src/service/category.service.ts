import Category from '../model/category.model';
import { InternalServerError } from '../error/errorHandler';

export class categoryService {
    public static async allCategories(page: number, pageSize: number): Promise<object> {
        const totalCount = await Category.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);
        if (page < 1 || page > totalPages) {
            throw new InternalServerError('Category Not FOund');
        }
        const skip = (page - 1) * pageSize;
        let findCategory = await Category.find().skip(skip).limit(pageSize).select('-_id')
        if (!findCategory) {
            throw new InternalServerError('Book Not Found');
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

    public static async updateCategory(category: string): Promise<object> {
        let findcategory = await Category.findOneAndUpdate({ name: category }).select('-_id')
        if (!findcategory) {
            throw new InternalServerError('Category Not Found');
        }
        return { message: "Category Updated", data: findcategory }
    }

    public static async deleteCategory(category: string): Promise<object> {
        let findcategory = await Category.findOneAndDelete({ name: category }).select('-_id')
        if (!findcategory) {
            throw new InternalServerError('Category Not Found');
        }
        return { message: "Category Deleted", data: findcategory }
    }

}