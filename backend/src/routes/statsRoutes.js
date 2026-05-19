const express = require('express');
const router = express.Router();
const { saveHandles, getStats } = require('../controllers/statsController');
const { protect } = require('../utils/authMiddleware');

router.post('/handles', protect, saveHandles);
router.get('/stats', protect, getStats);

module.exports = router;