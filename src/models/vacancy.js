const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema(
  {
    vacancyId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    minYearsExperience: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Vacancy', vacancySchema);