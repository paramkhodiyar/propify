const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        console.log(`User registered: ${newUser.email}`);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to create user!' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials!' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid Credentials!' });
        }

        // Generate Token
        const age = 1000 * 60 * 60 * 24 * 7; // 1 week

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role, // useful payload
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );

        const { password: userPassword, ...userInfo } = user;

        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'PRODUCTION', // set to true in production
                maxAge: age,
            })
            .status(200)
            .json(userInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to login!' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token').status(200).json({ message: 'Logout Successful' });
};
const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        const { password, ...userInfo } = user;
        res.status(200).json(userInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to fetch user" });
    }
}
module.exports = { register, login, logout, me };
