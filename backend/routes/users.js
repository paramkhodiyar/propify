const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    saveListing,
    getProfilePosts,
    getNotificationNumber,
    requestUpgrade
} = require('../controllers/user.js');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, authorizeRoles("ADMIN"), getUsers);
// router.get('/search/:id', verifyToken, getUser);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.post('/:id/upgrade', verifyToken, requestUpgrade); // Upgrade request endpoint
router.post('/save', verifyToken, saveListing);
router.get('/profilePosts', verifyToken, getProfilePosts);
router.get('/notification', verifyToken, getNotificationNumber);

module.exports = router;
