require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 
const connectDB = require('./config/db');
const idiomRoutes = require('./routes/idiomRoutes');
const { checkJwt } = require('./middleware/auth'); 

const app = express();


connectDB(); 


app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 


app.use('/api/idioms', idiomRoutes);


 app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.send('API сервера IdiomFlow запущена и защищена Auth0...');
});


app.use((req, res, next) => {
  const error = new Error(`Не найдено — ${req.originalUrl}`);
  res.status(404);
  next(error);
});


app.use((err, req, res, next) => {

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Токен отсутствует или недействителен' });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Сервер работает на: http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`❌ Критическая ошибка: ${err.message}`);
  server.close(() => process.exit(1));
});