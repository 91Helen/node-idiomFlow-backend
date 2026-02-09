const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');


const { 
    getIdioms, 
    createIdiom, 
    deleteIdiom 
} = require('../controllers/idiomController');

// Маршрут: /api/idioms
router.route('/')
  
    .get( getIdioms)
 
    .post(checkJwt, createIdiom);

// Маршрут: /api/idioms/:id
router.route('/:id')
  
   
    .delete(checkJwt, deleteIdiom);

module.exports = router;