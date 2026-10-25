import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  time: { type: String, required: true },
  event: { type: String, required: true },
}, { _id: false });

const suspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  isCulprit: { type: Boolean, default: false },
}, { _id: false });

const evidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['CHAT', 'IMAGE_CCTV', 'AUDIO', 'DOCUMENT'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isClue: { type: Boolean, default: false },
}, { _id: false });

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 80 },
  scenarioPrompt: { type: String, required: true, maxlength: 2000 },
  category: { type: String, enum: ['CRIME', 'MISSING_PERSON', 'THEFT', 'CORPORATE', 'SUPERNATURAL'], required: true },
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: true },
  tone: { type: String, required: true },
  briefing: {
    location: { type: String, required: true },
    timeOfIncident: { type: String, required: true },
    summary: { type: String, required: true },
    timeline: { type: [timelineSchema], default: [] },
  },
  suspects: { type: [suspectSchema], required: true },
  evidence: { type: [evidenceSchema], required: true },
  status: { type: String, enum: ['ACTIVE', 'SOLVED', 'FAILED'], default: 'ACTIVE' },
  resolution: { culpritId: String, explanation: String },
}, { timestamps: true });

export default mongoose.model('Case', caseSchema);
