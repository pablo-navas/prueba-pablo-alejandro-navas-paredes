const applicationService = require('../services/application.service');

const createApplication = async (req, res) => {
  try {
    const application = await applicationService.createApplication(req.body);
    return res.status(201).json({
      message: 'Postulación creada exitosamente',
      data: application
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const { status, vacancyId } = req.query;
    const applications = await applicationService.getApplications({ status, vacancyId });
    return res.status(200).json({ count: applications.length, data: applications });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'El campo status es obligatorio.' });
    }

    const updatedApp = await applicationService.updateApplicationStatus(id, status);
    return res.status(200).json({
      message: 'Estado de postulación actualizado correctamente',
      data: updatedApp
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus
};