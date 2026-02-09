const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');
const { 
    syncProfile, 
    updateScore, 
    getLeaderboard 
} = require('../controllers/userController');

// 1. Лидерборд 
router.get('/leaderboard', getLeaderboard);

// 2. Синхронизация профиля 
router.post('/sync', checkJwt, syncProfile);

// 3. Обновление очков 
router.post('/update-score', checkJwt, updateScore);

module.exports = router;