const { calculateScoreAndPriority } = require('../services/priority.service');

describe('Pruebas unitarias para el cálculo de Puntaje y Prioridad (Sección 6)', () => {
  test('Caso 1: Candidato con experiencia suficiente, fuente REFERRAL y palabras clave otorga puntuación TOP', () => {
    // Exp >= requerida (+4), REFERRAL (+3), Palabras "node" y "api" (+2) -> Total 9 -> TOP
    const result = calculateScoreAndPriority({
      candidateExperience: 5,
      minYearsExperience: 3,
      source: 'REFERRAL',
      coverLetter: 'I build REST APIs with Node.js and SQL.',
      activeOtherApplicationsCount: 0
    });

    expect(result.score).toBe(9);
    expect(result.priority).toBe('TOP');
  });

  test('Caso 2: Candidato con penalización por 3 o más postulaciones activas', () => {
    // Exp >= req (+4), INTERNAL (+2), Sin palabras (+0), Penalización 3 activas (-2) -> Total 4 -> MEDIUM
    const result = calculateScoreAndPriority({
      candidateExperience: 4,
      minYearsExperience: 2,
      source: 'INTERNAL',
      coverLetter: 'Desarrollador backend buscando nuevos retos.',
      activeOtherApplicationsCount: 3
    });

    expect(result.score).toBe(4);
    expect(result.priority).toBe('MEDIUM');
  });

  test('Caso 3: El puntaje no puede ser negativo y asigna prioridad LOW', () => {
    // Exp < req (+0), OTHER (+0), Sin palabras (+0), Penalización 3 activas (-2) -> Resultado -2 -> Ajustado a 0 -> LOW
    const result = calculateScoreAndPriority({
      candidateExperience: 1,
      minYearsExperience: 5,
      source: 'OTHER',
      coverLetter: 'Experiencia básica.',
      activeOtherApplicationsCount: 4
    });

    expect(result.score).toBe(0);
    expect(result.priority).toBe('LOW');
  });
});