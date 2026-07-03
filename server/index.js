import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors'
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import supplierRoutes from './routes/supplier.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';
import orderRouter from './routes/order.js';
import dashboardRouter from './routes/dashboard.js'


const app = express();
app.get('/', (req, res) => {
    res.json({
        message: "🚀 THIS IS THE NEW SERVER RESPONSE",
        time: new Date().toISOString()
    });
});
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.get('/api/test-login-route', (req, res) => {
    res.json({
        success: true,
        authRouteShouldBe: '/api/auth/login'
    });
});
app.post('/api/auth/test-login', (req, res) => {
    res.json({
        success: true,
        message: "POST auth route is working",
        body: req.body
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/product', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRouter );
app.use('/api/dashboard', dashboardRouter );
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();