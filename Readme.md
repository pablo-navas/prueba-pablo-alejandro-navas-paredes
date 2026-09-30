PI REST de Gestión de Postulaciones LaboralesAPI REST desarrollada con Node.js, Express y MongoDB (Mongoose) diseñada para automatizar la recepción, priorización determinística y gestión del estado de postulaciones de candidatos a vacantes laborales.📋 Tabla de ContenidosCaracterísticas PrincipalesStack TecnológicoEstructura del ProyectoRequisitos Previos e InstalaciónConfiguración de Variables de EntornoPoblado de Datos Iniciales (Seed)Ejecución de la AplicaciónPruebas AutomatizadasDocumentación de EndpointsReglas de Negocio IncorporadasRespuestas sobre Inteligencia Artificial🚀 Características PrincipalesRegistro de Postulaciones (POST /api/applications): Valida la existencia del candidato, el estado activo de la vacante (OPEN), y la regla de duplicidad antes de registrar.Cálculo Automático de Prioridad: Determina el puntaje y nivel de prioridad (LOW, MEDIUM, HIGH, TOP) basándose en experiencia, fuente, carta de presentación y postulaciones activas simultáneas.Consulta y Filtrado (GET /api/applications): Permite listar postulaciones enriquecidas con datos del candidato y la vacante, ordenadas dinámicamente por puntaje (descendente) y fecha de creación (ascendente). Permite filtros combinados por estado y vacante.Gestión de Estados (PUT /api/applications/:id/status): Actualización de estado garantizando que postulaciones en estados finales (REJECTED, HIRED) no puedan ser modificadas.Validación de Duplicidad: Previene postulaciones dobles si hay procesos activos o si no han transcurrido 30 días desde un rechazo previo.🛠️ Stack TecnológicoEntorno de Ejecución: Node.js (v18+)Framework Web: Express.jsBase de Datos: MongoDBODM (Object Data Modeling): MongoosePruebas Automatizadas: JestVariables de Entorno: dotenv📁 Estructura del Proyectogestion-postulaciones-api/
├── src/
│   ├── config/
│   │   └── database.js            # Conexión a MongoDB con Mongoose
│   ├── controllers/
│   │   └── application.controller.js # Controladores de peticiones HTTP
│   ├── models/
│   │   ├── Application.js         # Esquema de Postulación
│   │   ├── Candidate.js           # Esquema de Candidato
│   │   └── Vacancy.js             # Esquema de Vacante
│   ├── routes/
│   │   └── application.routes.js    # Definición de rutas Express
│   ├── services/
│   │   ├── application.service.js   # Lógica principal del dominio y orquestación
│   │   └── priority.service.js      # Cálculo puramente determinístico de prioridad
│   ├── tests/
│   │   └── priority.test.js       # Pruebas unitarias con Jest
│   └── app.js                     # Configuración de Express y Middlewares
├── .env                           # Variables de entorno local
├── package.json                   # Dependencias y scripts
├── RESPUESTAS.md                  # Análisis técnico sobre integración de IA
├── seed.js                        # Script para popular la base de datos
└── server.js                      # Punto de entrada y arranque del servidor
💻 Requisitos Previos e InstalaciónRequisitosNode.js v18.x o superiorMongoDB v6.0+ ejecutándose localmente o una URI de MongoDB Atlas.InstalaciónClonar el repositorio e ingresar a la carpeta del proyecto:git clone 
cd gestion-postulaciones-api
Instalar las dependencias del proyecto:npm install
⚙️ Configuración de Variables de EntornoCrea un archivo .env en la raíz del proyecto basándote en la siguiente configuración:PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/gestion_postulaciones
NODE_ENV=development
🌱 Poblado de Datos Iniciales (Seed)Para ejecutar la API con datos iniciales (3 candidatos y 2 vacantes, una de ellas en estado CLOSED), ejecuta el script de seed:node seed.js
🏃 Ejecución de la AplicaciónModo Desarrollo (con recarga automática)npm run dev
Modo Producciónnpm start
El servidor estará escuchando en http://localhost:3000.🧪 Pruebas AutomatizadasEl proyecto incluye pruebas unitarias para validar la lógica del cálculo de puntaje y asignación de prioridad bajo distintas condiciones de negocio.Para ejecutar las pruebas:npm test
📖 Documentación de Endpoints1. Registrar una PostulaciónRuta: POST /api/applicationsDescripción: Registra una nueva postulación, calculando automáticamente su puntaje y prioridad.Ejemplo de Cuerpo de la Petición (JSON):{
  "candidateId": 3,
  "vacancyId": 1,
  "source": "REFERRAL",
  "coverLetter": "I have four years of experience building REST APIs with Node.js and SQL databases"
}
Respuesta Exitosa (201 Created):{
  "message": "Postulación creada exitosamente",
  "data": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "candidateId": 3,
    "vacancyId": 1,
    "source": "REFERRAL",
    "coverLetter": "I have four years of experience building REST APIs with Node.js and SQL databases",
    "score": 9,
    "priority": "TOP",
    "status": "RECEIVED",
    "createdAt": "2026-09-30T12:00:00.000Z",
    "updatedAt": "2026-09-30T12:00:00.000Z"
  }
}
2. Consultar PostulacionesRuta: GET /api/applicationsDescripción: Obtiene las postulaciones ordenadas por puntaje (de mayor a menor) y por fecha de creación (de más antigua a más reciente). Permite filtros por estado y/o vacante.Parámetros de Consulta (Query Params):status (Opcional): RECEIVED, IN_REVIEW, REJECTED, HIREDvacancyId (Opcional): Identificador numérico de la vacante.Ejemplos de Solicitud:GET /api/applications?status=IN_REVIEWGET /api/applications?status=RECEIVED&vacancyId=1Respuesta Exitosa (200 OK):{
  "count": 1,
  "data": [
    {
      "_id": "651a2b3c4d5e6f7a8b9c0d1e",
      "candidateId": 3,
      "vacancyId": 1,
      "source": "REFERRAL",
      "coverLetter": "...",
      "score": 9,
      "priority": "TOP",
      "status": "RECEIVED",
      "createdAt": "2026-09-30T12:00:00.000Z",
      "updatedAt": "2026-09-30T12:00:00.000Z",
      "candidateName": "Pablo Navas",
      "candidateEmail": "pablo.navas@email.com",
      "vacancyTitle": "Backend Developer Node.js"
    }
  ]
}
3. Cambiar Estado de una PostulaciónRuta: PUT /api/applications/:id/statusDescripción: Actualiza el estado de una postulación existente.Ejemplo de Cuerpo de la Petición (JSON):{
  "status": "IN_REVIEW"
}
Respuesta Exitosa (200 OK):{
  "message": "Estado de postulación actualizado correctamente",
  "data": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "status": "IN_REVIEW",
    "updatedAt": "2026-09-30T12:35:00.000Z"
  }
}
⚖️ Reglas de Negocio Incorporadas1. Regla de PriorizaciónEl puntaje final es la suma acumulada de las siguientes condiciones (piso en 0):Años de experiencia candidato $\ge$ requeridos por la vacante: +4 ptsFuente REFERRAL: +3 ptsFuente INTERNAL: +2 ptsCarta de presentación contiene "node", "sql" o "api" (case-insensitive): +2 ptsCarta de presentación $> 500$ caracteres: +1 ptCandidato con 3 o más postulaciones activas en otras vacantes: -2 ptsEscala de Prioridad segun Puntaje:0 a 2: LOW3 a 4: MEDIUM5 a 6: HIGH7 o más: TOP2. Regla de DuplicidadUn candidato no puede tener dos postulaciones activas (RECEIVED, IN_REVIEW) o una postulación aprobada (HIRED) para la misma vacante.Si fue previamente rechazado (REJECTED) en esa vacante, deben haber transcurrido al menos 30 días desde la última actualización de estado para volver a postularse.