import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4004;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Order Service DB Connected");
    } catch (error) {
        console.error("DB connection error:", error);
    }
};

connectDB();

// Routes
app.use('/api/order', orderRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ service: 'order-service', status: 'healthy' });
});

app.listen(port, () => {
    console.log(`Order Service running on port ${port}`);
});