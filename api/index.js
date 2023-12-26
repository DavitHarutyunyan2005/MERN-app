import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routers/user.route.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    try{
        console.log('Connected')
    } catch(err){
        console.log(err);
    }
})

const app = express();


app.listen(3000, ()=>{
    try{
        console.log('Server running on 3000 port')
    }catch {
        console.log("error")
    }
})

app.use('/api/user', userRouter);