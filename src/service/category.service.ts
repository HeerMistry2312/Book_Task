import Category from '../model/category.model';
import { InternalServerError } from '../error/errorHandler';

export class CategoryService {
    public static async AllCategories(page: number, pageSize: number): Promise<object> {
        const totalCount = await Category.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);
        if (page < 1 || page > totalPages) {
            throw new InternalServerError('Category Not FOund');
        }
        const skip = (page - 1) * pageSize;
        let cat = await Category.find().skip(skip).limit(pageSize).select('-_id')
        if (!cat) {
            throw new InternalServerError('Book Not Found');
        }
        return {
            categories: cat,
            totalCategories: totalCount,
            totalPages: totalPages,
            currentPage: page
        };
    }

    public static async createCategory(category: string): Promise<object> {
        let categori = new Category({ name: category })
        let newCat = await categori.save()
        return { message: "Category Added", data: newCat }
    }

    public static async updateCategory(category: string): Promise<object> {
        let categori = await Category.findOneAndUpdate({ name: category }).select('-_id')
        if (!categori) {
            throw new InternalServerError('Category Not Found');
        }
        return { message: "Category Updated", data: categori }
    }

    public static async deleteCategory(category: string): Promise<object> {
        let categori = await Category.findOneAndDelete({ name: category }).select('-_id')
        if (!categori) {
            throw new InternalServerError('Category Not Found');
        }
        return { message: "Category Deleted", data: categori }
    }

}