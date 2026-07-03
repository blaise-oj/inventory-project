import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:3000";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                await login(response.data.user, response.data.token);

                if (rememberMe) {
                    localStorage.setItem("rememberEmail", email);
                } else {
                    localStorage.removeItem("rememberEmail");
                }

                if (response.data.user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/customer-dashboard');
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:flex flex-col justify-between bg-slate-950 text-white p-10">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xl mb-6">
                            GIS
                        </div>

                        <h1 className="text-3xl font-bold leading-tight">
                            Glorious Inventory System
                        </h1>

                        <p className="text-slate-400 mt-4">
                            Manage products, suppliers, users, stock and orders from one clean dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/10 rounded-2xl p-4">
                            <p className="text-2xl font-bold">Stock</p>
                            <p className="text-slate-400">Inventory control</p>
                        </div>

                        <div className="bg-white/10 rounded-2xl p-4">
                            <p className="text-2xl font-bold">Orders</p>
                            <p className="text-slate-400">Customer tracking</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    <div className="md:hidden mb-6 text-center">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mb-3">
                            GIS
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Glorious Inventory System
                        </h1>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-sm text-gray-500 mt-1 mb-6">
                        Login to continue to your dashboard.
                    </p>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Email
                            </label>

                            <input
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Password
                            </label>

                            <input
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <label className="inline-flex items-center text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>

                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-semibold py-2.5 px-4 rounded-lg ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;