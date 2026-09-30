require('dotenv').config();
const mongoose = require('mongoose');
const Candidate = require('./src/models/Candidate');
const Vacancy = require('./src/models/Vacancy');
const { Application } = require('./src/models/Application');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB para poblar datos...');

    await Candidate.deleteMany({});
    await Vacancy.deleteMany({});
    await Application.deleteMany({});

    await Candidate.insertMany([
      { candidateId: 1, name: 'Carlos Mendoza', email: 'carlos.mendoza@email.com', yearsOfExperience: 5 },
      { candidateId: 2, name: 'Ana María Gómez', email: 'ana.gomez@email.com', yearsOfExperience: 2 },
      { candidateId: 3, name: 'Pablo Navas', email: 'pablo.navas@email.com', yearsOfExperience: 4 }
    ]);

    await Vacancy.insertMany([
      { vacancyId: 1, title: 'Backend Developer Node.js', minYearsExperience: 3, status: 'OPEN' },
      { vacancyId: 2, title: 'Database Administrator SQL', minYearsExperience: 4, status: 'CLOSED' }
    ]);

    console.log('Datos iniciales insertados con éxito (3 candidatos y 2 vacantes).');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos:', error.message);
    process.exit(1);
  }
};

seedData();