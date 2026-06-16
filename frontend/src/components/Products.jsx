import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
    const [openModal, setOpenModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        supplierId: ''
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/product", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },

            });
            if (response.data.success) {
                setSuppliers(response.data.suppliers);
                setCategories(response.data.categories);
                setProducts(response.data.products);
                setFilteredProducts(response.data.products);
            } else {
                console.error("Failed to fetch products:", response.data.message);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleEdit = (product) => {
        setEditProduct(product);

        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId._id,
            supplierId: product.supplierId._id,
        });

        setOpenModal(true);
    };
    const handleDelete = async (id) => {
            const confirmDelete = window.confirm("Are you sure you want to delete this product?");
            if (confirmDelete) {
                try {                const response = await axios.delete(`http://localhost:3000/api/product/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    );
                    if (response.data.success) {
                        alert('Product deleted successfully!');
                        fetchProducts();
                    } else {
                        console.error('Error deleting product:', response.data.message);
                        alert('Error deleting product. Please try again.');
                    }
                } catch (error) {
                    console.error('Error deleting product:', error);
                    alert('Error deleting product. Please try again.');
                }
            }
        }
    const closeModal = () => {
        setOpenModal(false);
        setEditProduct(null);

        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            categoryId: '',
            supplierId: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        try {
            let response;

            if (editProduct) {
                // EDIT MODE → USE PUT (your backend supports this)
                response = await axios.put(
                    `http://localhost:3000/api/product/${editProduct._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );
            } else {
                // ADD MODE
                response = await axios.post(
                    'http://localhost:3000/api/product/add',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );
            }

            if (response.data.success) {
                alert(editProduct ? 'Product updated' : 'Product added successfully');
                fetchProducts();
                closeModal();
            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message);
        }
    };
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter((product) => product.name.toLowerCase().includes(query));
        setFilteredProducts(filtered);
    };

    return (
        <div className='w-full h-full flex flex-col gap-4 p-4'>
            <h1 className='text-2xl font-bold mb-8'>Product Management</h1>
            <div className='flex justify-between items-center'>
                <input type="text" placeholder='Search products...' className='border p-1 bg-white rounded px-4'
                onChange={handleSearch}
                />

            </div>
            <div>
                <button
                    type="button"
                    className='px-4 py-1.5 bg-blue-500 text-white rounded  cursor-pointer mb-5'
                    onClick={() => setOpenModal(true)}
                >
                    Add Product
                </button>
                <div>
                    <table className='w-full bg-white rounded shadow-md'>
                        <thead>
                            <tr>
                                <th className='border border-gray-300 p-2'>S.No</th>
                                <th className='border border border-gray-300 p-2'>Product Name</th>
                                <th className='border border border-gray-300 p-2'>Category Name</th>
                                <th className='border border border-gray-300 p-2'>Supplier Name</th>
                                <th className='border border border-gray-300 p-2'>Price</th>
                                <th className='border border border-gray-300 p-2'>Stock</th>
                                <th className='border border border-gray-300 p-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts && filteredProducts.map((product, index) => (
                                <tr key={product._id}>
                                    <td className='border border border-gray-300 p-2'>{index + 1}</td>
                                    <td className='border border border-gray-300 p-2'>{product.name}</td>
                                    <td className='border border border-gray-300 p-2'>{product.categoryId?.categoryName}</td>
                                    <td className='border border border-gray-300 p-2'>{product.supplierId?.name}</td>
                                    <td className='border border border-gray-300 p-2'>{product.price}</td>
                                    <td className='border border border-gray-300 p-2'>
                                        <span className='rounded-full font-semibold'>
                                            {product.stock == 0 ? (
                                                <span className='bg-red-100 text-red-500 px-2 py-1 rounded-full'>{product.stock}</span>
                                            ) : product.stock < 5 ? (
                                                <span className='bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full'>{product.stock}</span>
                                            ) : (<span className='bg-green-100 text-green-500 px-2 py-1 rounded-full'>{product.stock}</span>)
                                            }
                                        </span>
                                    </td>
                                    <td className='border border border-gray-300 p-2 flex gap-2'>
                                        <button
                                            className='px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer'
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className='px-2 py-1 bg-red-500 text-white rounded cursor-pointer'
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(filteredProducts ?? []).length === 0 && <div className='text-center p-4'>No products found.</div>}
                </div>

            </div>
            {openModal && (
                <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
                    <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
                        <h1 className='text-xl font-bold'>
                            {editProduct ? "Edit Product" : "Add Product"}
                        </h1>
                        <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer' onClick={() => setOpenModal(false)}>X</button>
                        <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                placeholder='Product Name'
                                className='border p-1 bg-white rounded px-4'
                            />

                            <input
                                type="text"
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                placeholder='Description'
                                className='border p-1 bg-white rounded px-4'
                            />

                            <input
                                type="number"
                                name='price'
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder='Enter Price'
                                className='border p-1 bg-white rounded px-4'
                            />

                            <input
                                type="number"
                                name='stock'
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder='Enter Stock Quantity'
                                className='border p-1 bg-white rounded px-4'
                            />
                            <div className='w-full border'>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className='w-full p-2'
                                >
                                    <option value="">Select Category</option>
                                    {categories && categories.map((category) => (
                                        <option key={category._id} value={category._id}>{category.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='w-full border'>
                                <select
                                    name="supplierId"
                                    value={formData.supplierId}
                                    onChange={handleChange}
                                    className='w-full p-2'
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers && suppliers.map((supplier) => (
                                        <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className='px-4 py-2 bg-blue-500 text-white rounded'
                                >
                                    {editProduct ? "Save Changes" : "Add Product"}
                                </button>


                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className='px-4 py-2 bg-red-500 text-white rounded'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>)}
        </div>
    )
}

export default Products
