const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { approveUser, rejectUser, approveListing, rejectListing, getPendingUsers, getPendingListings, getAllListings } = require('../controllers/admin');

const router = express.Router();

// All routes require Admin role
router.use(verifyToken, authorizeRoles('ADMIN'));

router.get('/pending-users', getPendingUsers);
router.post('/users/:id/approve', approveUser);
router.post('/users/:id/reject', rejectUser);


router.get('/pending-listings', getPendingListings);
router.get('/all-listings', getAllListings); // New route
router.post('/listings/:id/approve', approveListing);
router.post('/listings/:id/reject', rejectListing);

module.exports = router;
