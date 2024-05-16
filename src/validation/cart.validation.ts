import * as yup from 'yup';
import { CartInterface } from '../interfaces/imports';

class CartValidation {
    private cartSchema = yup.object().shape({
        bookName: yup.string()
        .required('BookName is required')
        .matches(/^[A-Za-z]/, 'BookName must be start with character'),
        quantity: yup.number().required('Quantity is required')

    })

    private decrementSchema = yup.object().shape({
        bookName: yup.string()
        .required('BookName is required')
        .matches(/^[A-Za-z]/, 'BookName must be start with character'),

    })

    validateCart(data: CartInterface): Promise<{bookName: string, quantity: number}> {
        return this.cartSchema.validate(data, { abortEarly: false });
      }

      validateDecrementBook(data: CartInterface): Promise<{bookName: string}> {
        return this.cartSchema.validate(data, { abortEarly: false });
      }
}
export default new CartValidation();