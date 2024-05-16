import UserValidation from "./user.validation";
import CategoryValidation from "./category.validation";
import CartValidation from "./cart.validation";
import BookValidation from "./book.validation";

const userValidation = new UserValidation();
const categoryValidation = new CategoryValidation();
const cartValidation = new CartValidation();
const bookValidation = new BookValidation();
export {
    userValidation,
    categoryValidation,
    cartValidation,
    bookValidation
}