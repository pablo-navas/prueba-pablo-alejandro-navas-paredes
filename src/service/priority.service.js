/**
 * Servicio puro para el cálculo de puntaje y asignación de prioridad.
 * 
 * Reglas de Puntaje:
 * 1. Coincidencia de Experiencia:
 *    - Si experiencia del candidato >= años requeridos: 50 puntos base + 5 puntos por cada año extra (máx 25 extra).
 *    - Si experiencia del candidato < años requeridos: 10 puntos por cada año de experiencia del candidato.
 * 2. Bonificación por Fuente:
 *    - INTERNAL: 30 puntos.
 *    - REFERRAL: 20 puntos.
 *    - JOB_BOARD: 10 puntos.
 *    - OTHER: 0 puntos.
 * 
 * Umbrales de Prioridad:
 * - Puntaje >= 80 -> HIGH
 * - Puntaje >= 50 -> MEDIUM
 * - Puntaje < 50  -> LOW
 */

const SOURCE_BONUS = {
    INTERNAL: 30,
    REFERRAL: 20,
    JOB_BOARD: 10,
    OTHER: 0
  };
  
  const calculateScoreAndPriority = (candidateExperience, requiredExperience, source) => {
    let score = 0;
  
    // 1. Evaluación de Experiencia
    if (candidateExperience >= requiredExperience) {
      const extraYears = candidateExperience - requiredExperience;
      const experienceBonus = Math.min(extraYears * 5, 25);
      score += 50 + experienceBonus;
    } else {
      score += candidateExperience * 10;
    }
  
    // 2. Bonificación por Fuente
    const sourceBonus = SOURCE_BONUS[source] || 0;
    score += sourceBonus;
  
    // 3. Determinación de Nivel de Prioridad
    let priority = 'LOW';
    if (score >= 80) {
      priority = 'HIGH';
    } else if (score >= 50) {
      priority = 'MEDIUM';
    }
  
    return { score, priority };
  };
  
  module.exports = {
    calculateScoreAndPriority
  };