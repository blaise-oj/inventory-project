import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    categoryDescription: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
});

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;