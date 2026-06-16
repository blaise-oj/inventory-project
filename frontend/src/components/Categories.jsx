import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editCategory, setEditCategory] = useState(null);


    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/category', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data.categories);
            setCategories(response.data.categories);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editCategory) {
            try {
                console.log("EDIT CATEGORY:", editCategory);
                console.log("TOKEN:", localStorage.getItem("token"));
                console.log("URL:", `http://localhost:3000/api/category/${editCategory}`);

                const response = await axios.put(
                    `http://localhost:3000/api/category/${editCategory}`,
                    { categoryName, categoryDescription },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                console.log(response.data);

                if (response.data.success) {
                    setEditCategory(null);
                    setCategoryName('');
                    setCategoryDescription('');
                    fetchCategories();
                }
            } catch (error) {
                console.error("UPDATE ERROR:", error.response?.data || error);
            }
        } else {
            const response = await axios.post('http://localhost:3000/api/category/add', { categoryName, categoryDescription },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (response.data.success) {
                setCategoryName('');
                setCategoryDescription('');
                alert('Category added successfully!');
                fetchCategories();
            } else {
                console.error('Error adding category');
                alert('Error adding category. Please try again.');
            }
        }
    };
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/category/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (response.data.success) {
                    alert('Category deleted successfully!');
                    fetchCategories();
                } else {
                    console.error('Error deleting category:', response.data.message);
                    alert('Error deleting category. Please try again.');
                }
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    alert('Error deleting category. Please try again.');
                }
            }
        }
    }


    const handleEdit = async (category) => {

        console.log("CATEGORY:", category);
        console.log("CATEGORY ID:", category._id);
        setEditCategory(category._id);
        setCategoryName(category.categoryName);
        setCategoryDescription(category.categoryDescription);
    }

    const handleCancel = async () => {
        setEditCategory(null);
        setCategoryName('');
        setCategoryDescription('');
    }

    if (loading) return <div>Loading categories...</div>;

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>Category Management</h1>
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>{editCategory ? 'Edit Category' : 'Add Category'}</h2>
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Category Name</label>
                                <input
                                    type="text"
                                    placeholder='Enter Category Name'
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Description</label>
                                <textarea
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    placeholder='Enter Category Description'
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div>
                                <button type="submit" className='bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
                                    {editCategory ? 'Save Changes' : 'Add Category'}
                                </button>
                                {
                                    editCategory && (
                                        <button
                                            type="button"
                                            className='ml-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                            onClick={() => { handleCancel }}
                                        >
                                            Cancel
                                        </button>
                                    )
                                }
                            </div>
                        </form>
                    </div>

                </div>
                <div className='lg:w-2/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <table className='w-full border-collapse border border-gray-200'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='border border-gray-200 p-2'>S. No</th>
                                    <th className='border border-gray-200 p-2'>Description</th>
                                    <th className='border border-gray-200 p-2'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={index}>
                                        <td className='border border-gray-200 p-2'>{index + 1}</td>
                                        <td className='border border-gray-200 p-2'>{category.categoryName}</td>
                                        <td className='border border-gray-200 p-2'>
                                            <button className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ml-2'
                                                onClick={() => handleEdit(category)}>
                                                Edit
                                            </button>
                                            <button className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600 ml-2'
                                                onClick={() => { handleDelete(category._id) }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categories
