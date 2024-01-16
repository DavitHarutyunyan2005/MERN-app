import errorHandler from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.models.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
    res.json({
        message: "Hallelujah.",
    });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return next(errorHandler(401, 'You can only update your own account!'));
    try {
        // Check if the updated username is already taken
        const existingUsername = await User.findOne({ username: req.body.username });
        if (existingUsername && existingUsername._id.toString() !== req.params.id) {
            return next(errorHandler(409, 'Username is not available.'));
        }

        // Check if the updated email is already taken
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail && existingEmail._id.toString() !== req.params.id) {
            return next(errorHandler(409, 'Email is not available.'));
        }

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 13);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {



                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};




//Delete account

export const deleteUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can  delete only your account.'));
    
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User is deleted');
    } catch (error) {
        next(error);
    }


}


//showing listings

export const getUserListings = async (req, res, next)=> {
        if(req.user.id !== req.params.id)return next(errorHandler(401, 'You can only view your own listings'));
            try {
                const listings = await Listing.find({userRef: req.params.id});
                res.status(200).json(listings);
            } catch (error) {
                next(error);
            }
    
} ;


export const getUser = async(req, res, next)=> {

    try {
        const user = await User.findById(req.params.id);

        if(!user) return next(errorHandler(404, 'User not found'));
        const {password: pass, ...rest} = user._doc;
    
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}