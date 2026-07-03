import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:3000";

const Suppliers = () => {
    const [addModal, setAddModal] = useState(false);
    const [editSupplier, setEditSupplier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const fetchSuppliers = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}/api/supplier`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setSuppliers(response.data.suppliers);
            setFilteredSuppliers(response.data.suppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
        });

        setEditSupplier(null);
        setAddModal(true);
    };

    const handleEdit = (supplier) => {
        setFormData({
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
        });

        setEditSupplier(supplier);
        setAddModal(true);
    };

    const closeModal = () => {
        setAddModal(false);
        setEditSupplier(null);

        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            if (editSupplier) {
                response = await axios.put(
                    `${API_URL}/api/supplier/${editSupplier._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );
            } else {
                response = await axios.post(
                    `${API_URL}/api/supplier/add`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );
            }

            if (response.data.success) {
                alert(editSupplier ? 'Supplier updated successfully!' : 'Supplier added successfully!');
                fetchSuppliers();
                closeModal();
            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${API_URL}/api/supplier/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                alert('Supplier deleted successfully!');
                fetchSuppliers();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting supplier');
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();

        const filtered = suppliers.filter((supplier) =>
            supplier.name.toLowerCase().includes(query) ||
            supplier.email.toLowerCase().includes(query) ||
            supplier.phone.toLowerCase().includes(query) ||
            supplier.address.toLowerCase().includes(query)
        );

        setFilteredSuppliers(filtered);
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
                    <p className="text-sm text-gray-500">
                        Manage suppliers, contacts and addresses.
                    </p>
                </div>

                <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                    onClick={openAddModal}
                >
                    Add Supplier
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-3 sm:p-4 mb-5">
                <input
                    type="text"
                    placeholder="Search suppliers..."
                    className="w-full border border-gray-300 p-2.5 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleSearch}
                />
            </div>

            {loading ? (
                <div className="bg-white rounded-xl shadow p-6">
                    Loading suppliers...
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-900 text-white">
                                <tr>
                                    <th className="p-4 text-left">S.No</th>
                                    <th className="p-4 text-left">Supplier Name</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Phone</th>
                                    <th className="p-4 text-left">Address</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSuppliers.map((supplier, index) => (
                                    <tr key={supplier._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4 font-semibold text-gray-900">
                                            {supplier.name}
                                        </td>
                                        <td className="p-4 text-gray-600">{supplier.email}</td>
                                        <td className="p-4 text-gray-600">{supplier.phone}</td>
                                        <td className="p-4 text-gray-600">{supplier.address}</td>

                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                                                    onClick={() => handleEdit(supplier)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                                    onClick={() => handleDelete(supplier._id)}
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
                        {filteredSuppliers.map((supplier, index) => (
                            <div key={supplier._id} className="bg-white rounded-2xl shadow p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-gray-400">
                                        #{index + 1}
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-gray-900">
                                    {supplier.name}
                                </h2>

                                <div className="mt-4 space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-400">Email</p>
                                        <p className="font-semibold text-gray-800 break-all">
                                            {supplier.email}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-400">Phone</p>
                                        <p className="font-semibold text-gray-800">
                                            {supplier.phone}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-400">Address</p>
                                        <p className="font-semibold text-gray-800">
                                            {supplier.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-5">
                                    <button
                                        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"
                                        onClick={() => handleEdit(supplier)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                                        onClick={() => handleDelete(supplier._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredSuppliers.length === 0 && (
                        <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500 mt-4">
                            No suppliers found.
                        </div>
                    )}
                </>
            )}

            {addModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative">
                        <h1 className="text-xl font-bold text-gray-900 mb-4">
                            {editSupplier ? 'Edit Supplier' : 'Add Supplier'}
                        </h1>

                        <button
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                            onClick={closeModal}
                            type="button"
                        >
                            X
                        </button>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Supplier Name"
                                className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Supplier Email"
                                className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Supplier Phone Number"
                                className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Supplier Address"
                                className="border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                                >
                                    {editSupplier ? 'Save Changes' : 'Add Supplier'}
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

export default Suppliers;