import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import cartRouter from './routes/cartRoute.js';

const app = express();
const port = process.env.PORT || 4003;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Cart Service DB Connected");
    } catch (error) {
        console.error("DB connection error:", error);
    }
};

connectDB();

// Routes
app.use('/api/cart', cartRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ service: 'cart-service', status: 'healthy' });
});

app.listen(port, () => {
    console.log(`Cart Service running on port ${port}`);
});