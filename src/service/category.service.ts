import { Category } from "../model/imports";
import { AppError } from "../utils/imports";
import StatusConstants from "../constant/status.constant";
import { CategoryPipeline } from "../query/imports";

export class CategoryService {
  public static async allCategories(
    page: number,
    pageSize: number,
    searchQuery: string,
    sortBy: string,
    sortOrder: string
  ): Promise<object> {
    if (page <= 0 || !Number.isInteger(page)) {
      throw new AppError(
        StatusConstants.INVALID_DATA.body.message,
        StatusConstants.INVALID_DATA.httpStatusCode
      );
    }

    const allCategories = await CategoryPipeline.CategoryPipeline(
      page,
      pageSize,
      searchQuery,
      sortBy
    );

    const totalCount = (await Category.findAndCountAll()).count;
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      allCategories,
      totalCategories: totalCount,
      totalPages,
      currentPage: page,
    };
  }

  public static async createCategory(category: string): Promise<object> {
    const newcategory = await Category.create({ name: category });
    const result = await CategoryPipeline.findCategoryPipeline(newcategory.id);
    return { message: "Category Added", data: result };
  }

  public static async updateCategory(
    category: string,
    categoryName: string
  ): Promise<object> {
    const findCategory = await Category.findOne({ where: { name: category } });
    if (!findCategory) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }

    const updateCategory = await findCategory.update({ name: categoryName });
    const result = await CategoryPipeline.findCategoryPipeline(
      updateCategory.id
    );
    return { message: "Category Updated", data: result };
  }

  public static async deleteCategory(categoryName: string): Promise<object> {
    let findcategory = await Category.findOne({
      where: { name: categoryName },
    });
    if (!findcategory) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const result = await CategoryPipeline.findCategoryPipeline(findcategory.id);
    await Category.destroy({ where: { id: findcategory.id } });

    return { message: "Category Deleted", data: result };
  }
}
