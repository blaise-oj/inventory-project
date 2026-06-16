import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

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
            const response = await axios.get('http://localhost:3000/api/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(response.data.users);
            setFilteredUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = users.filter((user) => user.name.toLowerCase().includes(query));
        setFilteredUsers(filtered);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
            const response = await axios.post('http://localhost:3000/api/users/add',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (response.data.success) {
                alert('User added successfully!');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    address: '',
                    role: '',
                });
                fetchUsers();
            } else {
                console.error('Error adding user');
                alert('Error adding user. Please try again.');
            }
        
    };
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {                const response = await axios.delete(`http://localhost:3000/api/users/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (response.data.success) {
                    alert('User deleted successfully!');
                    fetchUsers();
                } else {
                    console.error('Error deleting user:', response.data.message);
                    alert('Error deleting user. Please try again.');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user. Please try again.');
            }
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>Users Management</h1>
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>
                            Add User
                        </h2>
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>User Name</label>
                                <input
                                    type="text"
                                    placeholder='Enter Name'
                                    name='name'
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Email</label>
                                <input
                                    type="email"
                                    placeholder='Enter Email'
                                    name='email'
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Password</label>
                                <input
                                    type="password"
                                    placeholder='Enter Password'
                                    name='password'
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Address</label>
                                <input
                                type='address'
                                placeholder='Enter Address'
                                name='address'
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                onChange={handleChange}
                            />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Role</label>
                                <select name='role' className='border w-full p-2 rounded-md' 
                                onChange={handleChange}>
                                    <option value=''>Select Role</option>
                                    <option value='admin'>Admin</option>
                                    <option value='customer'>Customer</option>
                                </select>
                            </div>
                            <div>
                                <button type="submit" className='bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
                                    Add User
                                </button>
                                
                            </div>
                        </form>
                    </div>

                </div>
                <div className='lg:w-2/3'>
                <input type="text" placeholder='Search by name or email' className='mb-4 p-2 bg-white border border-gray-500 rounded-md w-full focus:ring-indigo-700 focus:border-indigo-500'
                onChange={handleSearch}
                />
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <table className='w-full border-collapse border border-gray-200'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='border border-gray-200 p-2'>S. No</th>
                                    <th className='border border-gray-200 p-2'>Name</th>
                                    <th className='border border-gray-200 p-2'>Email</th>
                                    <th className='border border-gray-200 p-2'>Address</th>
                                    <th className='border border-gray-200 p-2'>Role</th>
                                    <th className='border border-gray-200 p-2'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers && filteredUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td className='border border-gray-200 p-2'>{index + 1}</td>
                                        <td className='border border-gray-200 p-2'>{user.name}</td>
                                        <td className='border border-gray-200 p-2'>{user.email}</td>
                                        <td className='border border-gray-200 p-2'>{user.address}</td>
                                        <td className='border border-gray-200 p-2'>{user.role}</td>
                                        <td className='border border-gray-200 p-2'>
                                            <button className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                            onClick = {() => {handleDelete(user._id)}}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && <p className='text-center text-gray-500 mt-4'>No users found.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users
