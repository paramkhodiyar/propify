const express = require('express');
const { getListings, getListing, addListing, updateListing, deleteListing, getMyListings } = require('../controllers/listing');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', getListings);
router.get('/my-listings', verifyToken, getMyListings); // New route
router.get('/:id', getListing);
router.post('/', verifyToken, authorizeRoles("AGENT", "ADMIN"), addListing);
router.put('/:id', verifyToken, updateListing); // Owner check is inside controller
router.delete('/:id', verifyToken, deleteListing); // Owner check is inside controller

module.exports = router;
