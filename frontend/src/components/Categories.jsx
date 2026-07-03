import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:3000";

const Categories = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editCategory, setEditCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/api/category`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setEditCategory(null);
        setCategoryName('');
        setCategoryDescription('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            if (editCategory) {
                response = await axios.put(
                    `${API_URL}/api/category/${editCategory}`,
                    { categoryName, categoryDescription },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
            } else {
                response = await axios.post(
                    `${API_URL}/api/category/add`,
                    { categoryName, categoryDescription },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
            }

            if (response.data.success) {
                alert(editCategory ? 'Category updated successfully!' : 'Category added successfully!');
                resetForm();
                fetchCategories();
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");

        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${API_URL}/api/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                alert('Category deleted successfully!');
                fetchCategories();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting category');
        }
    };

    const handleEdit = (category) => {
        setEditCategory(category._id);
        setCategoryName(category.categoryName);
        setCategoryDescription(category.categoryDescription);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-100 p-6">
                <div className="bg-white rounded-xl shadow p-6">
                    Loading categories...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                <p className="text-sm text-gray-500">
                    Create, edit and manage product categories.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl shadow p-4 sm:p-6 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {editCategory ? 'Edit Category' : 'Add Category'}
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Category Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter Category Name"
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Description
                            </label>

                            <textarea
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                placeholder="Enter Category Description"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-semibold"
                            >
                                {editCategory ? 'Save Changes' : 'Add Category'}
                            </button>

                            {editCategory && (
                                <button
                                    type="button"
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg font-semibold"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    {/* Desktop table */}
                    <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-4 text-left">S.No</th>
                                    <th className="p-4 text-left">Category Name</th>
                                    <th className="p-4 text-left">Description</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4 font-semibold text-gray-900">
                                            {category.categoryName}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {category.categoryDescription}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                                    onClick={() => handleDelete(category._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {categories.map((category, index) => (
                            <div key={category._id} className="bg-white rounded-2xl shadow p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-400">
                                        #{index + 1}
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-gray-900">
                                    {category.categoryName}
                                </h2>

                                <p className="text-sm text-gray-500 mt-2">
                                    {category.categoryDescription}
                                </p>

                                <div className="grid grid-cols-2 gap-3 mt-5">
                                    <button
                                        className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
                                        onClick={() => handleEdit(category)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                                        onClick={() => handleDelete(category._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
                            No categories found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
