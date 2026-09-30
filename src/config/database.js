const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('La variable de entorno MONGODB_URI no está definida.');
    }

    await mongoose.connect(mongoUri);
    console.log('Conexión exitosa a la base de datos MongoDB');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;