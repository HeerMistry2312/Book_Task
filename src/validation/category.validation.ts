import * as yup from 'yup';
import { CategoryInterface } from '../interfaces/imports';

class CategoryValidation {
    private categorySchema = yup.object().shape({
        name: yup.string()
            .required('CategoryName is required')
            .matches(/^[A-Za-z][A-Za-z]*$/, 'CategoryName should contains characters only'),
    })

    validateCategory(data: CategoryInterface): Promise<{ name: string }> {
        return this.categorySchema.validate(data, { abortEarly: false });
      }
}
export default new CategoryValidation();