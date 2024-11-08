import mongoose from 'mongoose';

const cityWhetherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requestCount: {
    type: Number,
  },
  lastFetched: {
    type: Date,
  }
});

const Whether = mongoose.model('City', cityWhetherSchema);

export default Whether;
