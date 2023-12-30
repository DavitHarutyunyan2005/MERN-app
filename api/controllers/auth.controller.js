import User from '../models/user.models.js';
import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';
import errorHandler from '../utils/error.js';
import jwt from 'jsonwebtoken';




export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 13);
    const newUser = new User({ username, email, password: hashedPassword });


    try {
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({email});
        if(existingUser){
            next(errorHandler(409, "Username is not available."))
        }
        if(existingEmail){
            next(errorHandler(409, "Email is not available."))
        }
        await newUser.save();
        res.status(201).json( "User created successfully!" );
        

    } catch (err) {
        console.error("Error:", err);
        // next(err);
        next(errorHandler(550, 'error from the function.'));

    } 
};



// SIGN IN

export const signin = async (req, res, next) => {

    const { username, password } = req.body;

    try {
        
        const validUser = await User.findOne({ username });

        if (!validUser) return next(errorHandler(404, "User wasn't found."));
        
        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) return next(errorHandler(401, "Wrong credentials."));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);

    } catch (error) {
        next(error);  
        console.log(error);
    } 
};
