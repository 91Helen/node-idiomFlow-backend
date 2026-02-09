const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0Id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  name: { type: String },
  picture: { type: String },
  // НОВЫЕ ПОЛЯ ДЛЯ КВИЗА:
  bestScore: { 
    type: Number, 
    default: 0 
  },
  totalPoints: { 
    type: Number, 
    default: 0 
  },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Idiom' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);