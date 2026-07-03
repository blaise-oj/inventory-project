import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Users = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: '',
    });

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setUsers(response.data.users);
            setFilteredUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            address: '',
            role: '',
        });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();

        const filtered = users.filter((user) =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query)
        );

        setFilteredUsers(filtered);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/api/users/add`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.success) {
                alert('User added successfully!');
                resetForm();
                fetchUsers();
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error adding user');
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${API_URL}/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                alert('User deleted successfully!');
                fetchUsers();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting user');
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-100 p-6">
                <div className="bg-white rounded-xl shadow p-6">
                    Loading users...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                <p className="text-sm text-gray-500">
                    Add users and manage system access.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl shadow p-4 sm:p-6 h-fit">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Add User
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            value={formData.name}
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            value={formData.email}
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={formData.password}
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Enter Address"
                            name="address"
                            value={formData.address}
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="role"
                            value={formData.role}
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-500"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                        </select>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-semibold"
                        >
                            Add User
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow p-3 sm:p-4 mb-5">
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            className="w-full border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-4 text-left">S.No</th>
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Address</th>
                                    <th className="p-4 text-left">Role</th>
                                    <th className="p-4 text-left">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4 font-semibold text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {user.address}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold capitalize">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredUsers.map((user, index) => (
                            <div key={user._id} className="bg-white rounded-2xl shadow p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-gray-400">
                                        #{index + 1}
                                    </span>

                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold capitalize">
                                        {user.role}
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-gray-900">
                                    {user.name}
                                </h2>

                                <div className="mt-4 space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-400">Email</p>
                                        <p className="font-semibold text-gray-800 break-all">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-400">Address</p>
                                        <p className="font-semibold text-gray-800">
                                            {user.address}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="w-full mt-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500 mt-4">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;