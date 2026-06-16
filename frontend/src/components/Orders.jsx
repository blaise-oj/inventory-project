import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = React.useState([]);
    const filteredProducts = [];
const handleEdit = () => {};
const handleDelete = () => {};
const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },

            });
            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                console.error("Failed to fetch products:", response.data.message);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }
    useEffect(() => {
            fetchOrders();
        }, []);
  return (
   <div className='w-full h-full flex flex-col gap-4 p-4'>
            <h1 className='text-2xl font-bold mb-8'>Orders</h1>
                
                    <table className='w-full bg-white rounded shadow-md'>
                        <thead>
                            <tr>
                                <th className='border border-gray-300 p-2'>S.No</th>
                                <th className='border border border-gray-300 p-2'>Product Name</th>
                                <th className='border border border-gray-300 p-2'>Category Name</th>
                                <th className='border border border-gray-300 p-2'>Quantity</th>
                                <th className='border border border-gray-300 p-2'>Total Price</th>
                                <th className='border border border-gray-300 p-2'>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.map((order, index) => (
                                <tr key={order._id}>
                                    <td className='border border border-gray-300 p-2'>{index + 1}</td>
                                    <td className='border border border-gray-300 p-2'>{order.product.name}</td>
                                    <td className='border border border-gray-300 p-2'>{order.product.categoryId?.categoryName}</td>
                                    <td className='border border border-gray-300 p-2'>{order.quantity}</td>
                                    <td className='border border border-gray-300 p-2'>{order.totalPrice}</td>
                                    
                                    <td className='border border border-gray-300 p-2 flex gap-2'>
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(orders ?? []).length === 0 && <div className='text-center p-4'>No Orders found.</div>}
                </div>

            
    
  )
}

export default Orders
