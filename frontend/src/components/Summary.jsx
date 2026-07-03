import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaBox,
    FaChartLine,
    FaShoppingCart,
    FaWarehouse,
    FaExclamationTriangle,
    FaTrophy
} from 'react-icons/fa';

const API_URL = "http://localhost:3000";

const Summary = () => {
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalStock: 0,
        ordersToday: 0,
        revenue: 0,
        outOfStock: [],
        highestSaleProduct: null,
        lowStock: []
    });

    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/api/dashboard`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });

            setDashboardData(response.data.dashboardData);
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return `Ksh ${Number(amount || 0).toLocaleString()}`;
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center text-xl`}>
                {icon}
            </div>

            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
                <div className="bg-white rounded-xl shadow p-6">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">
                    Overview of inventory, sales and stock performance.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Products"
                    value={dashboardData.totalProducts}
                    icon={<FaBox />}
                    color="bg-blue-600"
                />

                <StatCard
                    title="Total Stock"
                    value={dashboardData.totalStock}
                    icon={<FaWarehouse />}
                    color="bg-green-600"
                />

                <StatCard
                    title="Orders Today"
                    value={dashboardData.ordersToday}
                    icon={<FaShoppingCart />}
                    color="bg-yellow-500"
                />

                <StatCard
                    title="Revenue"
                    value={formatCurrency(dashboardData.revenue)}
                    icon={<FaChartLine />}
                    color="bg-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl shadow p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                            <FaExclamationTriangle />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">
                            Out of Stock
                        </h3>
                    </div>

                    {dashboardData.outOfStock?.length > 0 ? (
                        <div className="space-y-3">
                            {dashboardData.outOfStock.map((product, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl p-3"
                                >
                                    <p className="font-semibold text-gray-900">
                                        {product.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {product.category?.name ||
                                            product.categoryId?.categoryName ||
                                            'No category'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No products out of stock.
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                            <FaTrophy />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">
                            Highest Sale Product
                        </h3>
                    </div>

                    {dashboardData.highestSaleProduct?.name ? (
                        <div className="border border-gray-200 rounded-xl p-4">
                            <p className="text-xl font-bold text-gray-900">
                                {dashboardData.highestSaleProduct.name}
                            </p>

                            <div className="mt-4 space-y-2 text-sm">
                                <p className="text-gray-600">
                                    <strong>Category:</strong>{' '}
                                    {dashboardData.highestSaleProduct.category || 'No category'}
                                </p>

                                <p className="text-gray-600">
                                    <strong>Total Units Sold:</strong>{' '}
                                    {dashboardData.highestSaleProduct.totalQuantity}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            {dashboardData.highestSaleProduct?.message || 'No sale data available.'}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                            <FaWarehouse />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">
                            Low Stock
                        </h3>
                    </div>

                    {dashboardData.lowStock?.length > 0 ? (
                        <div className="space-y-3">
                            {dashboardData.lowStock.map((product, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {product.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {product.categoryId?.categoryName || 'No category'}
                                        </p>
                                    </div>

                                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                        {product.stock} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No low stock products.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Summary;