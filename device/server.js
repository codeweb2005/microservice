import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import deviceRouter from './routes/deviceRoute.js';

const app = express();
const port = process.env.PORT || 4002;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Device Service DB Connected");
    } catch (error) {
        console.error("DB connection error:", error);
    }
};

connectDB();

// Routes
app.use('/api/device', deviceRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ service: 'device-service', status: 'healthy' });
});

app.listen(port, () => {
    console.log(`Device Service running on port ${port}`);
});