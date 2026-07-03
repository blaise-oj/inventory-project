import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:3000";

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
        supplierId: '',
        image: null
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/product`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (response.data.success) {
                setSuppliers(response.data.suppliers);
                setCategories(response.data.categories);
                setProducts(response.data.products);
                setFilteredProducts(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const imageUrl = (image) => image ? `${API_URL}${image}` : null;

    const stockBadge = (stock) => {
        if (stock == 0) {
            return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">{stock}</span>;
        }

        if (stock < 5) {
            return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">{stock}</span>;
        }

        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">{stock}</span>;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
    };

    const handleEdit = (product) => {
        setEditProduct(product);

        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId?._id || '',
            supplierId: product.supplierId?._id || '',
            image: null
        });

        setOpenModal(true);
    };

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
            image: null
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("categoryId", formData.categoryId);
        data.append("supplierId", formData.supplierId);

        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            let response;

            if (editProduct) {
                response = await axios.put(
                    `${API_URL}/api/product/${editProduct._id}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            } else {
                response = await axios.post(
                    `${API_URL}/api/product/add`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            "Content-Type": "multipart/form-data"
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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");

        if (confirmDelete) {
            try {
                const response = await axios.delete(`${API_URL}/api/product/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data.success) {
                    alert('Product deleted successfully!');
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product. Please try again.');
            }
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(query)
        );

        setFilteredProducts(filtered);
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-sm text-gray-500">Manage products, images, stock and suppliers.</p>
                </div>

                <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                    onClick={() => setOpenModal(true)}
                >
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-3 sm:p-4 mb-5">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleSearch}
                />
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-900 text-white">
                        <tr>
                            <th className="p-4 text-left">S.No</th>
                            <th className="p-4 text-left">Image</th>
                            <th className="p-4 text-left">Product</th>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Supplier</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Stock</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <tr key={product._id} className="hover:bg-gray-50 border-b">
                                <td className="p-4">{index + 1}</td>

                                <td className="p-4">
                                    {product.image ? (
                                        <img
                                            src={imageUrl(product.image)}
                                            alt={product.name}
                                            className="w-24 h-24 object-cover rounded-xl shadow border"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs border">
                                            No Image
                                        </div>
                                    )}
                                </td>

                                <td className="p-4 font-semibold text-gray-800 max-w-[230px]">
                                    <div>{product.name}</div>
                                    <div className="text-sm text-gray-500 font-normal line-clamp-2">
                                        {product.description}
                                    </div>
                                </td>

                                <td className="p-4 text-gray-700">{product.categoryId?.categoryName}</td>
                                <td className="p-4 text-gray-700">{product.supplierId?.name}</td>
                                <td className="p-4 font-semibold">{product.price}</td>
                                <td className="p-4">{stockBadge(product.stock)}</td>

                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                            onClick={() => handleDelete(product._id)}
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

            {/* MOBILE CARDS */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredProducts.map((product, index) => (
                    <div key={product._id} className="bg-white rounded-2xl shadow p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                            {stockBadge(product.stock)}
                        </div>

                        {product.image ? (
                            <img
                                src={imageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-52 object-cover rounded-xl border mb-4"
                            />
                        ) : (
                            <div className="w-full h-52 bg-gray-100 rounded-xl border mb-4 flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}

                        <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                            <div>
                                <p className="text-gray-400">Category</p>
                                <p className="font-semibold text-gray-800">{product.categoryId?.categoryName}</p>
                            </div>

                            <div>
                                <p className="text-gray-400">Supplier</p>
                                <p className="font-semibold text-gray-800">{product.supplierId?.name}</p>
                            </div>

                            <div>
                                <p className="text-gray-400">Price</p>
                                <p className="font-semibold text-gray-800">{product.price}</p>
                            </div>

                            <div>
                                <p className="text-gray-400">Stock</p>
                                <p>{stockBadge(product.stock)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-5">
                            <button
                                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"
                                onClick={() => handleEdit(product)}
                            >
                                Edit
                            </button>

                            <button
                                className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                                onClick={() => handleDelete(product._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {(filteredProducts ?? []).length === 0 && (
                <div className="text-center p-6 bg-white rounded-xl shadow mt-4">
                    No products found.
                </div>
            )}

            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto relative">
                        <h1 className="text-xl font-bold text-gray-900 mb-4">
                            {editProduct ? "Edit Product" : "Add Product"}
                        </h1>

                        <button
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                            onClick={closeModal}
                            type="button"
                        >
                            X
                        </button>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {editProduct?.image && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Current Product Image
                                    </p>

                                    <div className="w-full h-56 sm:h-72 border rounded-xl overflow-hidden bg-gray-100">
                                        <img
                                            src={imageUrl(editProduct.image)}
                                            alt={editProduct.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Product Name"
                                className="border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter Price"
                                    className="border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="number"
                                    name="stock"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="Enter Stock Quantity"
                                    className="border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="border border-gray-300 p-2.5 bg-white rounded-lg"
                            />

                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="supplierId"
                                value={formData.supplierId}
                                onChange={handleChange}
                                className="border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier._id} value={supplier._id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                                >
                                    {editProduct ? "Save Changes" : "Add Product"}
                                </button>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;