const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Синхронизация профиля (Auth0 -> MongoDB)
const syncProfile = asyncHandler(async (req, res) => {
    const { email, name, picture } = req.body;
    const auth0Id = req.auth.payload.sub;

    const user = await User.findOneAndUpdate(
        { auth0Id },
        { email, name, picture },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(user);
});

// @desc    Обновление очков и рекорда
const updateScore = asyncHandler(async (req, res) => {
    const { score } = req.body;
    const auth0Id = req.auth.payload.sub;

    if (typeof score !== 'number') {
        res.status(400);
        throw new Error("Score должен быть числом");
    }

    const user = await User.findOne({ auth0Id });

    if (!user) {
        res.status(404);
        throw new Error("Пользователь не найден");
    }

    // логика обновления
    user.totalPoints += score;

    if (score > (user.bestScore || 0)) {
        user.bestScore = score;
    }

    await user.save();
    
    res.status(200).json({ 
        message: "Очки успешно зачислены!",
        bestScore: user.bestScore, 
        totalPoints: user.totalPoints 
    });
});

// @desc    Топ-10 пользователей
const getLeaderboard = asyncHandler(async (req, res) => {
    const leaders = await User.find({})
        .sort({ totalPoints: -1 })
        .limit(10)
        .select('name picture totalPoints bestScore');

    res.status(200).json(leaders);
});

module.exports = { syncProfile, updateScore, getLeaderboard };