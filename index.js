import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
// import crypto from 'crypto';
// const randomBytes = crypto.randomBytes(256).toString('base64');
// console.log(randomBytes);


dotenv.config();

const app = express();
const MONGODB_URL = process.env.MONGODB_URL
const port = process.env.PORT || 8000


const corsOptions = {
    origin: true
}

// middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser())
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/review', reviewRoutes);

app.get('/', (req, res)=> {
    res.send('Api is working')
})

// database connection
mongoose.set('strictQuery', false);
const connectDb = async() => {
    try{
    await mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('Mongodb is connected!!');
    }
    catch(err){
        console.log('Mongodb connection is a failure :( ');
    }
}

app.listen(port, () => {
    connectDb();
    console.log(`App is listening on port ${port}`);
})








