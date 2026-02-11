const asyncHandler = require('express-async-handler');
const Idiom = require('../models/Idiom');

/**
 * @desc    Получить СВОИ идиомы + ОБЩУЮ библиотеку
 * @route   GET /api/idioms
 */
const getIdioms = asyncHandler(async (req, res) => {
    const userId = req.auth?.payload?.sub;
    let query;

    if (userId) {
        query = {
            $or: [
                { userId: userId },
                { isPublic: true }
            ]
        };
    } else {
        query = { isPublic: true };
    }

    const idioms = await Idiom.find(query).sort({ createdAt: -1 });
    res.status(200).json(idioms);
});

/**
 * @desc    Создать личную идиому
 * @route   POST /api/idioms
 */
const createIdiom = asyncHandler(async (req, res) => {
    const { phrase, meaning, example, category, imageUrl, isPublic } = req.body;
    const userId = req.auth?.payload?.sub;

    if (!userId) {
        res.status(401);
        throw new Error("Нужна авторизация для создания записи");
    }

    if (!phrase || !meaning) {
        res.status(400);
        throw new Error("Заполните обязательные поля: фраза и значение");
    }

    const newIdiom = await Idiom.create({
        phrase,
        meaning,
        example,
        category: category || 'General',
        imageUrl: imageUrl || 'https://placehold.co/400',
        userId,
        isPublic: isPublic !== undefined ? isPublic : true
    });

    res.status(201).json(newIdiom);
});

/**
 * @desc    Удалить идиому (только свою)
 * @route   DELETE /api/idioms/:id
 */
const deleteIdiom = asyncHandler(async (req, res) => {
    const userId = req.auth?.payload?.sub;

    if (!userId) {
        res.status(401);
        throw new Error("Нужна авторизация для удаления");
    }

    const idiom = await Idiom.findById(req.params.id);

    if (!idiom) {
        res.status(404);
        throw new Error("Идиома не найдена");
    }

    if (idiom.userId !== userId) {
        res.status(403);
        throw new Error("Отказано в доступе");
    }

    await idiom.deleteOne();
    res.status(200).json({ id: req.params.id, message: "Успешно удалено" });
});

module.exports = { getIdioms, createIdiom, deleteIdiom };
