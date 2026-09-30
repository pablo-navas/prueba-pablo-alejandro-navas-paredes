require('dotenv').config();
const app = require('./src/app');
const connectDatabase = require('./src/config/database');

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
});