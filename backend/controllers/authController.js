const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Using bcryptjs for secure password hashing

/**
 * Utility function to generate a JSON Web Token (JWT)
 * Includes both the user ID and their role in the payload for frontend routing
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // 1. Verify if user already exists to prevent duplicate accounts
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Cryptographically hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the user with default 'user' role
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            role: 'user' 
        });

        // 4. Return user data and token for immediate login
        res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role,
            token: generateToken(user.id, user.role) 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server configuration error', error: error.message });
    }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Locate the user by email
        const user = await User.findOne({ email });

        // 2. Compare the plain text password with the hashed password in DB
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                token: generateToken(user.id, user.role) 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server authentication error', error: error.message });
    }
};

/**
 * @desc    Get user profile data
 * @route   GET /api/auth/profile
 * @access  Private (Requires Token)
 */
const getProfile = async (req, res) => {
    try {
        // Find user by ID embedded in the JWT token
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving profile', error: error.message });
    }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/profile
 * @access  Private (Requires Token)
 */
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided in request, otherwise keep existing
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Note: If updating password, we would need to re-hash it here.
        // For scope of this project, we limit profile updates to name and email.

        const updatedUser = await user.save();
        
        res.json({ 
            id: updatedUser.id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            role: updatedUser.role,
            token: generateToken(updatedUser.id, updatedUser.role) 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };