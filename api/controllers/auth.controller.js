//Auth Controller
import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import errorHandler from '../utils/error.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();





export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;                  
    const hashedPassword = bcryptjs.hashSync(password, 13);
    const newUser = new User({ username, email, password: hashedPassword });
    


    try {
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingUser) {
            return  next(errorHandler(409, "Username is not available"))
        }
        if(username.length < 6) return next(errorHandler(422, 'Username must contain at least 6 characters'));

        if (existingEmail) {
            return next(errorHandler(409, "Email is not available"))
        }

        if (password.length < 8) return next(errorHandler(422, 'Password must contain at least 8 characters'));
                    
        await newUser.save();
        res.status(201).json("User created successfully");


    } catch (err) {
        console.error("Error:", err);
        next(errorHandler(550, 'error from the function.'));

    }
};



// SIGN IN

export const signin = async (req, res, next) => {

    const { email, password } = req.body;

    try {

        const validUser = await User.findOne({ email });

        if (!validUser) return next(errorHandler(404, "Email does not exist"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) return next(errorHandler(401, "Password is invalid"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

    } catch (error) {
        next(error);
        console.log(error);
    }
};

//google and facebook auth

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);

        } else {
            const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 13);
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + randomDigits.toString(), email: req.body.email, password: hashedPassword, avatar: req.body.photo });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

        }
    } catch (error) {
        next(error);

    }
}



export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
};