const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_LINK);
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Ошибка подключения: ${err.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;