import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryInterface extends Document {
    name: string;
}

const categorySchema = new Schema<CategoryInterface>({
    name: { type: String, required: true, unique: true },
});

const Category = mongoose.model<CategoryInterface>('Category', categorySchema);

export default Category;
