const mongoose = require('mongoose');

const ALLOWED_SOURCES = ['REFERRAL', 'INTERNAL', 'JOB_BOARD', 'OTHER'];
const ALLOWED_STATUSES = ['RECEIVED', 'IN_REVIEW', 'REJECTED', 'HIRED'];

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: Number,
      required: true,
      ref: 'Candidate',
      index: true
    },
    vacancyId: {
      type: Number,
      required: true,
      ref: 'Vacancy',
      index: true
    },
    coverLetter: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      enum: ALLOWED_SOURCES,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    priority: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      required: true
    },
    status: {
      type: String,
      enum: ALLOWED_STATUSES,
      default: 'RECEIVED',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = {
  Application: mongoose.model('Application', applicationSchema),
  ALLOWED_SOURCES,
  ALLOWED_STATUSES
};