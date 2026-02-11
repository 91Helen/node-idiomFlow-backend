const mongoose = require('mongoose');

const idiomSchema = new mongoose.Schema({
  phrase: { 
    type: String, 
    required: [true, 'Фраза обязательна'], 
    trim: true    
  },
  meaning: { 
    type: String, 
    required: [true, 'Значение обязательно'], 
    trim: true 
  },
  example: { 
    type: String, 
    required: [true, 'Пример использования обязателен'] 
  },
  category: { 
    type: String, 
    default: 'General',
    enum: ['General', 'Slang', 'Business', 'Food', 'Emotion', 'Health', 'Work']
  },
  imageUrl: { 
    type: String,
    default: 'https://placehold.co/400'
  },
  userId: {
    type: String,
    required: false, 
    index: true 
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Idiom', idiomSchema);
