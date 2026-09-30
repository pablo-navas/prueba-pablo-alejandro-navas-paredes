const { Router } = require('express');
const {
  createApplication,
  getApplications,
  updateApplicationStatus
} = require('../controllers/application.controller');

const router = Router();

router.post('/applications', createApplication);
router.get('/applications', getApplications);
router.put('/applications/:id/status', updateApplicationStatus);

module.exports = router;