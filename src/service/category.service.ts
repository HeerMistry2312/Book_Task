import Category from '../model/category.model';
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from '../constant/status.constant';
export class CategoryService {
    public static async allCategories(page: number, pageSize: number,searchQuery?: string, sortBy?: string): Promise<object> {

        const pipeline: any[] = [];
            if (searchQuery) {
                pipeline.push({
                    $match: {
                        $or: [
                            { name: { $regex: searchQuery, $options: 'i' } }
                        ]
                    }
                });
            }
            if (sortBy) {
                pipeline.push({
                    $sort: { [sortBy]: 1 }
                });
            }
            pipeline.push({ $skip: (page - 1) * pageSize },{ $limit: pageSize },{
                $project: {
                    _id: 0,
                    name: 1
                }
            });
            const categories = await Category.aggregate(pipeline);
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
        const pipeline = [
            {
                $match: {_id: newCategory._id}
            },
            {
                $project: {
                    _id: 0,
                    name: 1
                }
            }
        ]
        const result = await Category.aggregate(pipeline)
        return { message: "Category Added", data: result }
    }

    public static async updateCategory(category: string,categoryName:string): Promise<object> {
        const findCategory = await Category.findOne({name: categoryName})
        if(!findCategory){
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode)
        }
        await Category.findByIdAndUpdate(findCategory._id,{name:category})
        const pipeline = [
            {
                $match: {_id: findCategory._id}
            },
            {
                $project: {
                    _id: 0,
                    name: 1
                }
            }
        ]
        const result = await Category.aggregate(pipeline)
        return { message: "Category Updated", data: result }
    }

    public static async deleteCategory(category: string,categoryName:string): Promise<object> {
        let findcategory = await Category.findOne({name: categoryName})
        if (!findcategory) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const categoryId = findcategory._id;
       const pipeline = [
        {
            $match: {_id: categoryId}
        },
        {
            $project: {
                _id: 0,
                name: 1
            }
        }
    ]
    const result = await Category.aggregate(pipeline)
    await Category.findByIdAndDelete(categoryId,{name: category})
        return { message: "Category Deleted", data: result }
    }

}