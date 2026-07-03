import React, { useEffect, useState } from 'react';
import {
    FaBox,
    FaCog,
    FaHome,
    FaUsers,
    FaShoppingCart,
    FaSignOutAlt,
    FaTable,
    FaTruck
} from 'react-icons/fa';
import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', path: '/admin-dashboard', icon: <FaHome />, isParent: true },
        { name: 'Categories', path: '/admin-dashboard/categories', icon: <FaTable />, isParent: false },
        { name: 'Products', path: '/admin-dashboard/products', icon: <FaBox />, isParent: false },
        { name: 'Suppliers', path: '/admin-dashboard/suppliers', icon: <FaTruck />, isParent: false },
        { name: 'Orders', path: '/admin-dashboard/orders', icon: <FaShoppingCart />, isParent: false },
        { name: 'Users', path: '/admin-dashboard/users', icon: <FaUsers />, isParent: false },
        { name: 'Profile', path: '/admin-dashboard/profile', icon: <FaCog />, isParent: false },
        { name: 'Logout', path: '/admin-dashboard/logout', icon: <FaSignOutAlt />, isParent: false },
    ];

    const customerItems = [
        { name: 'Products', path: '/customer-dashboard', icon: <FaBox />, isParent: true },
        { name: 'Orders', path: '/customer-dashboard/orders', icon: <FaShoppingCart />, isParent: false },
        { name: 'Profile', path: '/customer-dashboard/profile', icon: <FaCog />, isParent: false },
        { name: 'Logout', path: '/customer-dashboard/logout', icon: <FaSignOutAlt />, isParent: false },
    ];

    const { user } = useAuth();
    const [menuLinks, setMenuLinks] = useState(customerItems);

    useEffect(() => {
        setMenuLinks(user?.role === 'admin' ? menuItems : customerItems);
    }, [user]);

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 md:w-56 bg-slate-950 text-white shadow-2xl z-40">
            <div className="h-full flex flex-col">
                <div className="h-16 flex items-center justify-center md:justify-start md:px-4 border-b border-white/10">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shadow">
                        GIS
                    </div>

                    <div className="hidden md:block ml-3">
                        <h1 className="text-base font-bold leading-tight">Glorious IS</h1>
                        <p className="text-xs text-slate-400">Inventory System</p>
                    </div>
                </div>

                <nav className="flex-1 px-2 py-4">
                    <ul className="space-y-1.5">
                        {menuLinks.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    end={item.isParent}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                                        ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                >
                                    <span className="text-lg min-w-[22px] flex items-center justify-center">
                                        {item.icon}
                                    </span>

                                    <span className="hidden md:block text-sm font-medium">
                                        {item.name}
                                    </span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="hidden md:block px-4 py-3 border-t border-white/10">
                    <p className="text-xs text-slate-500">Logged in as</p>
                    <p className="text-sm font-semibold truncate">
                        {user?.name || 'User'}
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;