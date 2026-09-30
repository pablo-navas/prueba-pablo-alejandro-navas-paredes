const express = require('express');
const applicationRoutes = require('./routes/application.routes');

const app = express();

app.use(express.json());
app.use('/api', applicationRoutes);

module.exports = app;