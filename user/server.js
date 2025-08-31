import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("User Service DB Connected");
    } catch (error) {
        console.error("DB connection error:", error);
    }
};

connectDB();

// Routes
app.use('/api/user', userRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ service: 'user-service', status: 'healthy' });
});

app.listen(port, () => {
    console.log(`User Service running on port ${port}`);
});