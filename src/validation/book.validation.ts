import * as yup from 'yup';
import { BookInterface } from '../interfaces/imports';
class BookValidation {
    private bookSchema = yup.object().shape({
        title: yup.string()
            .required('BookName is required')
            .matches(/^[A-Za-z]/, 'BookName must be start with character'),

        author: yup.string()
            .required('Author is required')
            .min(3, 'Author must be at least 3 characters')
            .max(20, 'Author must be at most 20 characters')
            .matches(/^[A-Za-z]/, 'Author must start with a letter'),

        categories: yup.array().required('Categories are required')
            .of(yup.string()
                .required('Categories are required')
                .matches(/^[A-Za-z][A-Za-z]*$/, 'Categories must contain only characters')
                ),

        description: yup.string()
            .required('Description is required')
            .min(3, 'Description must be at least 3 characters')
            .max(100, 'Description must be at most 100 characters')
            .matches(/^[A-Za-z]/, 'Description must start with a letter'),

        price: yup.number().required('Price is Required')
    })

    validateBook(data: BookInterface): Promise<{title: string, author:string, categories: string[], description: string, price: number }>{
        return this.bookSchema.validate(data, {abortEarly:false})
    }

    private updaetBookSchema = yup.object().shape({
        title: yup.string()
            .matches(/^[A-Za-z]/, 'BookName must be start with character'),

        author: yup.string()
            .min(3, 'Author must be at least 3 characters')
            .max(20, 'Author must be at most 20 characters')
            .matches(/^[A-Za-z]/, 'Author must start with a letter'),

        categories: yup.array()
            .of(yup.string()
                .matches(/^[A-Za-z][A-Za-z]*$/, 'Categories must contain only characters')
                ),

        description: yup.string()
            .min(3, 'Description must be at least 3 characters')
            .max(100, 'Description must be at most 100 characters')
            .matches(/^[A-Za-z]/, 'Description must start with a letter'),

        price: yup.number()
    })

    validateUpdateBook(data: BookInterface): Promise<{title?: string|undefined, author?:string|undefined, categories?: (string|undefined)[], description?: string|undefined, price?: number|undefined }>{
        return this.updaetBookSchema.validate(data, {abortEarly:false})
    }

    private bookAuthorSchema = yup.object().shape({
        title: yup.string()
            .required('BookName is required')
            .matches(/^[A-Za-z]/, 'BookName must be start with character'),

        categories: yup.array().required('Categories are required')
            .of(yup.string()
                .required('Categories are required')
                .matches(/^[A-Za-z][A-Za-z]*$/, 'Categories must contain only characters')
                ),

        description: yup.string()
            .required('Description is required')
            .min(3, 'Description must be at least 3 characters')
            .max(100, 'Description must be at most 100 characters')
            .matches(/^[A-Za-z]/, 'Description must start with a letter'),

        price: yup.number().required('Price is Required')
    })

    validateAuthorBook(data: BookInterface): Promise<{title: string, categories: string[], description: string, price: number }>{
        return this.bookSchema.validate(data, {abortEarly:false})
    }

    private updaetAuthorBookSchema = yup.object().shape({
        title: yup.string()
            .matches(/^[A-Za-z]/, 'BookName must be start with character'),
        categories: yup.array()
            .of(yup.string()
                .matches(/^[A-Za-z][A-Za-z]*$/, 'Categories must contain only characters')
                ),

        description: yup.string()
            .min(3, 'Description must be at least 3 characters')
            .max(100, 'Description must be at most 100 characters')
            .matches(/^[A-Za-z]/, 'Description must start with a letter'),

        price: yup.number()
    })

    validateUpdateAuthorBook(data: BookInterface): Promise<{title?: string|undefined, categories?: (string|undefined)[], description?: string|undefined, price?: number|undefined }>{
        return this.updaetBookSchema.validate(data, {abortEarly:false})
    }
}

export default BookValidation