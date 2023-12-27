import User from '../models/user.models.js';
import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';



export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 13);
    const newUser = new User({ username, email, password: hashedPassword});

    // Set createdAt and updatedAt fields
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    async function insertDocument() {
        const url = "mongodb://localhost:27017/";
        let client;

        try {
            client = new MongoClient(url);
            await client.connect();

            const dbo = client.db("Databs");



            // Corrected the object format and added await
            const result = await dbo.collection("collection").insertOne(newUser);
            await newUser.save();

            console.log("Documents inserted with IDs:", "username: ", newUser.username, "email: ", newUser.email, "password: ", newUser.password);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            if (client) {
                client.close();
            }
        }
    }
    insertDocument();

    res.status(201).json("User Created succesfully!");
}