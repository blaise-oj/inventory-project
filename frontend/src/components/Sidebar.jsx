import React, { useState, useEffect } from 'react'
import {FaBox, FaCog, FaHome, FaUsers, FaShoppingCart, FaSignOutAlt, FaTable, FaTruck} from 'react-icons/fa';
import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', path: '/admin-dashboard', icon: <FaHome />, isParent: true},
        { name: 'Categories', path: '/admin-dashboard/categories', icon: <FaTable />, isParent: false},
        { name: 'Products', path: '/admin-dashboard/products', icon: <FaBox />, isParent: false},
        { name: 'Suppliers', path: '/admin-dashboard/suppliers', icon: <FaTruck />, isParent: false},
        { name: 'Orders', path: '/admin-dashboard/orders', icon: <FaShoppingCart />, isParent: false},
        { name: 'Users', path: '/admin-dashboard/users', icon: <FaTable />, isParent: false},
        { name: 'Profile', path: '/admin-dashboard/profile', icon: <FaCog />, isParent: false},
        { name: 'Logout', path: '/admin-dashboard/logout', icon: <FaSignOutAlt />, isParent: false },
        
    ];
    const customerItems = [
        { name: 'Products', path: '/customer-dashboard', icon: <FaBox />, isParent: true},
        { name: 'Orders', path: '/customer-dashboard/orders', icon: <FaShoppingCart />, isParent: false},
        { name: 'Profile', path: '/customer-dashboard/profile', icon: <FaCog />, isParent: false},
        { name: 'Logout', path: '/customer-dashboard/logout', icon: <FaSignOutAlt />, isParent: false },
    ];
    const {user} = useAuth();
    const [menuLinks, setMenuLinks] = useState(customerItems);

    useEffect(() => {
        if(user && user.role === 'admin'){
            setMenuLinks(menuItems);
        }
    }, []);

  return (
    <div className='flex flex-col h-screen bg-black text-white w-16 md:w-64 fixed'>
        <div className='flex flex-items justify-center h-16'>
            <span className='hidden md:block text-xl font-bold p-5'>Glorious IS</span>
            <span className='md:hidden text-xl font-bold p-7'>GIS</span>
        </div>
        <div>
            <ul className='space-y-2 p-2'>
                {menuLinks.map((item) => (
                    <li key={item.name}>
    <NavLink
        end={item.isParent}
        to={item.path}
        className={({ isActive }) =>
            `flex items-center w-full px-4 py-3 rounded-lg transition duration-200
             ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
        }
    >
        <span className="text-xl flex items-center justify-center">
            {item.icon}
        </span>

        <span className="ml-4 hidden md:block">
            {item.name}
        </span>
    </NavLink>
</li>
                ))}
            </ul>
        </div>
      
    </div>
  )
}

export default Sidebar
