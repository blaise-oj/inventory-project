import User from '../models/User.js';
import bcrypt from 'bcrypt';

const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        const existingUser = await User.findOne({
            email,
            isDeleted: { $ne: true }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            address,
            role
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User added successfully'
        });
    } catch (error) {
        console.error('Error adding user:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: { $ne: true } }).select('-password');

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error in getting users'
        });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        }).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error in getting user profile'
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, address, password } = req.body;

        const updateData = {
            name,
            email,
            address
        };

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const user = await User.findOneAndUpdate(
            {
                _id: userId,
                isDeleted: { $ne: true }
            },
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating profile:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error in updating profile'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const existingUser = await User.findOne({
            _id: id,
            isDeleted: { $ne: true }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error in deleting user'
        });
    }
};

export {
    addUser,
    getUsers,
    deleteUser,
    getUser,
    updateUserProfile
};