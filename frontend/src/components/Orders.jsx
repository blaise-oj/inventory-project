import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:3000";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (response.data.success) {
                setOrders(response.data.orders);
                setFilteredOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();

        const filtered = orders.filter((order) =>
            order.product?.name?.toLowerCase().includes(query) ||
            order.product?.categoryId?.categoryName?.toLowerCase().includes(query)
        );

        setFilteredOrders(filtered);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB");
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500">
                    View product orders, quantities and totals.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-3 sm:p-4 mb-5">
                <input
                    type="text"
                    placeholder="Search orders..."
                    className="w-full border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleSearch}
                />
            </div>

            {loading ? (
                <div className="bg-white rounded-xl shadow p-6">
                    Loading orders...
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-4 text-left">S.No</th>
                                    <th className="p-4 text-left">Product Name</th>
                                    <th className="p-4 text-left">Category</th>
                                    <th className="p-4 text-left">Quantity</th>
                                    <th className="p-4 text-left">Total Price</th>
                                    <th className="p-4 text-left">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOrders.map((order, index) => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4 font-semibold text-gray-900">
                                            {order.product?.name || "Deleted product"}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {order.product?.categoryId?.categoryName || "N/A"}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                                {order.quantity}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-gray-900">
                                            {order.totalPrice}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {formatDate(order.orderDate)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredOrders.map((order, index) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-gray-400">
                                        #{index + 1}
                                    </span>

                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                        Qty: {order.quantity}
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-gray-900">
                                    {order.product?.name || "Deleted product"}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {order.product?.categoryId?.categoryName || "N/A"}
                                </p>

                                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">Quantity</p>
                                        <p className="font-semibold text-gray-800">{order.quantity}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-400">Total Price</p>
                                        <p className="font-semibold text-gray-800">{order.totalPrice}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-400">Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {formatDate(order.orderDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500 mt-4">
                            No orders found.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Orders;