import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routers/user.route.js';
import authRouter from './routers/auth.route.js';
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
app.use(express.json());


app.listen(3000, ()=>{
    try{
        console.log('Server running on 3000 port')
    }catch {
        console.log("error")
    }
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);


/* 
import { MongoClient } from 'mongodb';

async function insertDocument() {
    const url = "mongodb://localhost:27017/";
    let client;

    try {
        client = new MongoClient(url);
        await client.connect();

        const dbo = client.db("database");

        // Corrected the object format and added await
        const result = await dbo.collection("number1").insertMany([
            { name: 'Mane', lastname: 'Shahinyan', address: 'Yerevan' },
            { name: 'Khoren', lastname: 'Sargisyan', address: 'Yerevan' },
            { name: 'Suren', lastname: 'Manavazyan', address: 'Shenq' },
            { name: 'Shaqe', lastname: 'Saminyan', address: 'Shenq' },
        ]);

        console.log("Documents inserted with IDs:", result.insertedIds);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        if (client) {
            client.close();
        }
    }
}

insertDocument();



*/


