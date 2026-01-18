const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;


app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'https://propify-gamma.vercel.app', 'https://mayaai-microservice.onrender.com'],
    credentials: true
}));


app.get('/', (req, res) => {
    res.send('Propify Real Estate Backend is Running');
});


const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const userRoutes = require('./routes/users');
const inquiryRoutes = require('./routes/inquiries');
const contactRoute = require('./routes/contact');
const adminRoute = require('./routes/admin');
// const uploadTestRoute = require('./routes/uploadTest');
const uploadRoute = require('./routes/upload');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoute);
// app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/contact', contactRoute);
// app.use("/api/test", uploadTestRoute);
app.use("/api/upload", uploadRoute);
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});