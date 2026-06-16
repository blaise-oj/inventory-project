import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const Suppliers = () => {

    const [addModal, setAddModal] = useState(null);
    const [editSupplier, setEditSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/supplier', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data.suppliers);
            setSuppliers(response.data.suppliers);
            setFilteredSuppliers(response.data.suppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSuppliers();
    }, []);
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
        setAddModal(null);
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
                // EDIT MODE → USE PUT (your backend supports this)
                response = await axios.put(
                    `http://localhost:3000/api/supplier/${editSupplier._id}`,
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
                    'http://localhost:3000/api/supplier/add',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );
            }

            if (response.data.success) {
                alert(editSupplier ? 'Supplier updated' : 'Supplier added');
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
            if (confirmDelete) {
                try {                const response = await axios.delete(`http://localhost:3000/api/supplier/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    );
                    if (response.data.success) {
                        alert('Supplier deleted successfully!');
                        fetchSuppliers();
                    } else {
                        console.error('Error deleting supplier:', response.data.message);
                        alert('Error deleting supplier. Please try again.');
                    }
                } catch (error) {
                    if (error.response) {
                    alert(error.response.data.message);
                } else {
                    alert('Error deleting supplier. Please try again.');
                }
            }
            }
        }
        const handleSearch = (e) => {
            setFilteredSuppliers(
                suppliers.filter(supplier =>
                    supplier.name.toLowerCase().includes(e.target.value.toLowerCase())
                    
                )
            );
        }



    return (
        <div className='w-full h-full flex flex-col gap-4 p-4'>
            <h1 className='text-2xl font-bold mb-8'>Supplier Management</h1>
            <div className='flex justify-between items-center'>
                <input type="text" placeholder='Search suppliers...' className='border p-1 bg-white rounded px-4'
                onChange={handleSearch} />

            </div>
            <div>
                <button
                    type="button"
                    className='px-4 py-1.5 bg-blue-500 text-white rounded  cursor-pointer'
                    onClick={() => {
                        setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            address: '',
                        });

                        setEditSupplier(null);
                        setAddModal(true);
                    }}
                >
                    Add Supplier
                </button>
                
            </div>

            {loading ? (
                <div>Loading suppliers...</div>
            ) : (
                <div>
                <table className='w-full bg-white rounded shadow-md'>
                    <thead>
                        <tr>
                            <th className='border border border-gray-300 p-2'>S.No</th>
                            <th className='border border border-gray-300 p-2'>Supplier Name</th>
                            <th className='border border border-gray-300 p-2'>Email</th>
                            <th className='border border border-gray-300 p-2'>Phone</th>
                            <th className='border border border-gray-300 p-2'>Address</th>
                            <th className='border border border-gray-300 p-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map((supplier, index) => (
                            <tr key={supplier._id}>
                                <td className='border border border-gray-300 p-2'>{index + 1}</td>
                                <td className='border border border-gray-300 p-2'>{supplier.name}</td>
                                <td className='border border border-gray-300 p-2'>{supplier.email}</td>
                                <td className='border border border-gray-300 p-2'>{supplier.phone}</td>
                                <td className='border border border-gray-300 p-2'>{supplier.address}</td>
                                <td className='border border border-gray-300 p-2 flex gap-2'>
                                    <button
                                        className='px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer'
                                        onClick={() => {
                                            setFormData({
                                                name: supplier.name,
                                                email: supplier.email,
                                                phone: supplier.phone,
                                                address: supplier.address,
                                            });

                                            setEditSupplier(supplier);
                                            setAddModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button className='px-2 py-1 bg-red-500 text-white rounded cursor-pointer'
                                    onClick={() => handleDelete(supplier._id)}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSuppliers.length === 0 &&  <div className='text-center p-4'>No suppliers found.</div>}
                </div>
            )}
            {addModal && (
                <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
                    <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
                        <h1 className='text-xl font-bold'>
                            {editSupplier ? 'Edit Supplier' : 'Add Supplier'}
                        </h1>
                        <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer' onClick={closeModal}>X</button>
                        <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                placeholder='Supplier Name'
                                className='border p-2 rounded'
                            />

                            <input
                                type="email"
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='Supplier Email'
                                className='border p-2 rounded'
                            />

                            <input
                                type="number"
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder='Supplier Phone Number'
                                className='border p-2 rounded'
                            />

                            <input
                                type="text"
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                                placeholder='Supplier Address'
                                className='border p-2 rounded'
                            />

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className='px-4 py-2 bg-blue-500 text-white rounded'
                                >
                                    {editSupplier ? 'Save Changes' : 'Add Supplier'}
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
                </div>
            )}
        </div>
    )
}

export default Suppliers
