import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:3000";

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        address: '',
        password: ''
    });

    const [originalUser, setOriginalUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                const userData = {
                    name: response.data.user?.name ?? '',
                    email: response.data.user?.email ?? '',
                    address: response.data.user?.address ?? '',
                    password: ''
                };

                setUser(userData);
                setOriginalUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            alert("Error fetching user profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: user.name,
                email: user.email,
                address: user.address,
            };

            if (user.password.trim()) {
                payload.password = user.password;
            }

            const response = await axios.put(`${API_URL}/api/users/profile`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                alert('Profile updated successfully!');
                setEdit(false);
                fetchUser();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.message || "Error updating profile. Please try again.");
        }
    };

    const handleCancel = () => {
        if (originalUser) {
            setUser(originalUser);
        }

        setEdit(false);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
                <div className="bg-white rounded-xl shadow p-6">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                <p className="text-sm text-gray-500">
                    View and update your account information.
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <form
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {user.name || "User"}
                            </h2>
                            <p className="text-sm text-gray-500 break-all">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={user.name || ''}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                disabled={!edit}
                                className={`w-full p-2.5 border rounded-lg outline-none ${
                                    edit
                                        ? "bg-white focus:ring-2 focus:ring-blue-500"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={user.email || ''}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                disabled={!edit}
                                className={`w-full p-2.5 border rounded-lg outline-none ${
                                    edit
                                        ? "bg-white focus:ring-2 focus:ring-blue-500"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={user.address || ''}
                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                                disabled={!edit}
                                className={`w-full p-2.5 border rounded-lg outline-none ${
                                    edit
                                        ? "bg-white focus:ring-2 focus:ring-blue-500"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            />
                        </div>

                        {edit && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter new password optional"
                                    value={user.password || ''}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        {!edit ? (
                            <button
                                type="button"
                                onClick={() => setEdit(true)}
                                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-semibold"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-semibold"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;