import { useAuth } from '../context/AuthContext.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (user.role === 'employee') {
                navigate('/customer-dashboard');
            } else {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    return null; // or a loading spinner while redirecting
};

export default Root;
