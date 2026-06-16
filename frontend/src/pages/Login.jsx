import React, {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import { useNavigate } from "react-router";
import axios from "axios";

const Login = () => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);    
        const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });
            console.log(response.data);
            if (response.data.success) {
                await login(response.data.user, response.data.token);
                if (response.data.user.role === 'admin') {
                    navigate('/admin-dashboard');
                }else {
                    navigate('/customer-dashboard');
                }
    }         else {
                alert(response.data.error);
            }
        } catch (error) {
            if(error.response){
                setError(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-green-600 from-50% to-gray-100 to-50% space-y-6">
            <h2 className="text-3xl font-bold text-white">Glorious Inventory System</h2>
            <div className="border shadow-lg p-6 w-80 bg-white">
                <h2 className="text-2xl font-bold text-gray-800">Login</h2>
                {error && (
                    <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} >
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                            Email:
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="email" name="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                            Password:
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" id="password" name="password" 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password" required />
                    </div>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="form-checkbox text-blue-500" />
                            <span className="ml-2 text-gray-700">Remember me</span>
                        </label>
                    </div>
                    <div className="mb-4">
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-700">Forgot password?</a>
                    </div>
                    <div className="mb-4">
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            {loading ? 'Logging in...' : 'Login'}
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;