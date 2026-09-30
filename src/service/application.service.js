const { Application, ALLOWED_SOURCES, ALLOWED_STATUSES } = require('../models/Application');
const Candidate = require('../models/Candidate');
const Vacancy = require('../models/Vacancy');
const { calculateScoreAndPriority } = require('./priority.service');

class ApplicationService {
  async createApplication({ candidateId, vacancyId, source, coverLetter }) {
    // 1. Validar campos obligatorios
    if (!candidateId || !vacancyId || !source || !coverLetter) {
      const error = new Error('Todos los campos obligatorios deben ser provistos.');
      error.statusCode = 400;
      throw error;
    }

    // 2. Validar fuente de postulación
    if (!ALLOWED_SOURCES.includes(source)) {
      const error = new Error(`La fuente '${source}' no es permitida.`);
      error.statusCode = 400;
      throw error;
    }

    // 3. Verificar existencia del candidato
    const candidate = await Candidate.findOne({ candidateId });
    if (!candidate) {
      const error = new Error(`El candidato con ID ${candidateId} no existe.`);
      error.statusCode = 404;
      throw error;
    }

    // 4. Verificar existencia y estado de la vacante
    const vacancy = await Vacancy.findOne({ vacancyId });
    if (!vacancy) {
      const error = new Error(`La vacante con ID ${vacancyId} no existe.`);
      error.statusCode = 404;
      throw error;
    }

    if (vacancy.status !== 'OPEN') {
      const error = new Error('No se aceptan postulaciones para vacantes cerradas.');
      error.statusCode = 400;
      throw error;
    }

    // 5. Aplicar Regla de Duplicidad (Sección 8)
    const existingApplication = await Application.findOne({ candidateId, vacancyId }).sort({ createdAt: -1 });

    if (existingApplication) {
      const activeStatuses = ['RECEIVED', 'IN_REVIEW', 'HIRED'];
      if (activeStatuses.includes(existingApplication.status)) {
        const error = new Error('El candidato ya cuenta con una postulación activa o finalizada exitosamente para esta vacante.');
        error.statusCode = 409;
        throw error;
      }

      if (existingApplication.status === 'REJECTED') {
        const currentDate = new Date();
        const statusUpdateDate = new Date(existingApplication.updatedAt);
        const elapsedDays = (currentDate - statusUpdateDate) / (1000 * 60 * 60 * 24);

        if (elapsedDays < 30) {
          const remainingDays = Math.ceil(30 - elapsedDays);
          const error = new Error(`Deben transcurrir 30 días desde el rechazo para volver a postularse. Días restantes: ${remainingDays}.`);
          error.statusCode = 400;
          throw error;
        }
      }
    }

    // 6. Consultar información necesaria para calcular prioridad
    const { yearsOfExperience } = candidate;
    const { minYearsExperience } = vacancy;

    // 7. Calcular puntaje y determinar prioridad
    const { score, priority } = calculateScoreAndPriority(yearsOfExperience, minYearsExperience, source);

    // 8 y 9. Registrar postulación con estado inicial RECEIVED
    const newApplication = await Application.create({
      candidateId,
      vacancyId,
      source,
      coverLetter,
      score,
      priority,
      status: 'RECEIVED'
    });

    return newApplication;
  }

  async getApplications({ status, vacancyId }) {
    const filter = {};

    if (status) {
      if (!ALLOWED_STATUSES.includes(status)) {
        const error = new Error(`El estado de filtro '${status}' no es válido.`);
        error.statusCode = 400;
        throw error;
      }
      filter.status = status;
    }

    if (vacancyId) {
      filter.vacancyId = Number(vacancyId);
    }

    // Ordenar por puntaje (descendente) y fecha de creación (ascendente)
    const applications = await Application.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'candidates',
          localField: 'candidateId',
          foreignField: 'candidateId',
          as: 'candidate'
        }
      },
      {
        $lookup: {
          from: 'vacancies',
          localField: 'vacancyId',
          foreignField: 'vacancyId',
          as: 'vacancy'
        }
      },
      { \(unwind: '\)candidate' },
      { \(unwind: '\)vacancy' },
      {
        \(project: {id:1,
            candidateId: 1,
        vacancyId: 1,          
        source: 1,           
        coverLetter: 1,           
        score: 1,          
         priority: 1,          
          status: 1,           
          createdAt: 1,           
          updatedAt: 1,           
          'candidate.name': 1,           
          'candidate.email': 1,           
          'vacancy.title': 1         }},      
        {\)sort: {
          score: -1,
          createdAt: 1
        }
      }
    ]);

    return applications;
  }

  async updateApplicationStatus(id, newStatus) {
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      const error = new Error(`El estado '${newStatus}' no es permitido.`);
      error.statusCode = 400;
      throw error;
    }

    const application = await Application.findById(id);

    if (!application) {
      const error = new Error('La postulación no fue encontrada.');
      error.statusCode = 404;
      throw error;
    }

    const finalStatuses = ['REJECTED', 'HIRED'];
    if (finalStatuses.includes(application.status)) {
      const error = new Error(`No es posible cambiar el estado de una postulación en estado final (${application.status}).`);
      error.statusCode = 400;
      throw error;
    }

    application.status = newStatus;
    await application.save(); // Mongoose actualiza automáticamente 'updatedAt'

    return application;
  }
}

module.exports = new ApplicationService();