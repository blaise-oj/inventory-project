import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const CustomerProducts = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [orderData, setOrderData] = useState({
        productId: "",
        quantity: 1,
        total: 0,
        stock: 0,
        price: 0
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/product`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (response.data.success) {
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
            return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">Out</span>;
        }

        if (stock < 5) {
            return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">{stock} left</span>;
        }

        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{stock} in stock</span>;
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(query) ||
            product.categoryId?.categoryName?.toLowerCase().includes(query)
        );

        setFilteredProducts(filtered);
    };

    const handleChangeCategory = (e) => {
        const categoryId = e.target.value;

        if (!categoryId) {
            setFilteredProducts(products);
            return;
        }

        setFilteredProducts(
            products.filter((product) => product.categoryId?._id === categoryId)
        );
    };

    const handleOrderChange = (product) => {
        if (product.stock <= 0) {
            alert("This product is out of stock");
            return;
        }

        setSelectedProduct(product);

        setOrderData({
            productId: product._id,
            quantity: 1,
            total: product.price,
            stock: product.stock,
            price: product.price
        });

        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
        setOrderData({
            productId: '',
            quantity: 1,
            stock: 0,
            total: 0,
            price: 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/api/orders/add`, orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (response.data.success) {
                alert("Order added successfully");
                closeModal();
                fetchProducts();
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error placing order");
        }
    };

    const increaseQuantity = (e) => {
        const quantity = Number(e.target.value) || 1;

        if (quantity > orderData.stock) {
            alert('Not enough stock');
            return;
        }

        setOrderData((prev) => ({
            ...prev,
            quantity,
            total: quantity * prev.price
        }));
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-sm text-gray-500">
                    Browse available products and place orders.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-3 sm:p-4 mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                        name="category"
                        className="w-full bg-white border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChangeCategory}
                    >
                        <option value="">All Categories</option>

                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                        {product.image ? (
                            <img
                                src={imageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-56 object-cover"
                            />
                        ) : (
                            <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}

                        <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {product.name}
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {product.categoryId?.categoryName}
                                    </p>
                                </div>

                                {stockBadge(product.stock)}
                            </div>

                            <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between mt-5">
                                <div>
                                    <p className="text-xs text-gray-400">Price</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        Ksh {Number(product.price).toLocaleString()}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleOrderChange(product)}
                                    disabled={product.stock <= 0}
                                    className={`px-5 py-2.5 rounded-lg font-semibold text-white ${
                                        product.stock <= 0
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    Order
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500 mt-4">
                    No products found.
                </div>
            )}

            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative">
                        <h1 className="text-xl font-bold text-gray-900 mb-4">
                            Place Order
                        </h1>

                        <button
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                            onClick={closeModal}
                            type="button"
                        >
                            X
                        </button>

                        {selectedProduct && (
                            <div className="mb-4">
                                {selectedProduct.image ? (
                                    <img
                                        src={imageUrl(selectedProduct.image)}
                                        alt={selectedProduct.name}
                                        className="w-full h-48 object-contain bg-gray-100 rounded-xl border"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-100 rounded-xl border flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                <h2 className="text-lg font-bold mt-3">
                                    {selectedProduct.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Stock available: {selectedProduct.stock}
                                </p>
                            </div>
                        )}

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="number"
                                name="quantity"
                                value={orderData.quantity}
                                onChange={increaseQuantity}
                                min="1"
                                max={orderData.stock}
                                placeholder="Quantity"
                                className="border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="bg-gray-100 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Ksh {Number(orderData.total).toLocaleString()}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                                >
                                    Place Order
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

export default CustomerProducts;