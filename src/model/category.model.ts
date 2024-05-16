import mongoose, { Schema } from 'mongoose';

import { CategoryInterface } from '../interfaces/imports';

const categorySchema = new Schema<CategoryInterface>({
    name: { type: String, required: true, unique: true },
});

const Category = mongoose.model<CategoryInterface>('Category', categorySchema);

export default Category;
