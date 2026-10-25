import { Router } from 'express';
import OpenAI from 'openai';
import { randomUUID } from 'node:crypto';
import Case from '../models/Case.js';

const router = Router();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const categories = ['CRIME', 'MISSING_PERSON', 'THEFT', 'CORPORATE', 'SUPERNATURAL'];
const difficulties = ['EASY', 'MEDIUM', 'HARD'];
const outputSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    title: { type: 'string' },
    briefing: { type: 'object', additionalProperties: false, properties: {
      location: { type: 'string' }, timeOfIncident: { type: 'string' }, summary: { type: 'string' },
      timeline: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { time: { type: 'string' }, event: { type: 'string' } }, required: ['time', 'event'] } },
    }, required: ['location', 'timeOfIncident', 'summary', 'timeline'] },
    suspects: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { id: { type: 'string' }, name: { type: 'string' }, role: { type: 'string' }, alibi: { type: 'string' }, motive: { type: 'string' }, avatarUrl: { type: 'string' }, isCulprit: { type: 'boolean' } }, required: ['id', 'name', 'role', 'alibi', 'motive', 'avatarUrl', 'isCulprit'] } },
    evidence: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { id: { type: 'string' }, type: { type: 'string', enum: ['CHAT', 'IMAGE_CCTV', 'AUDIO', 'DOCUMENT'] }, title: { type: 'string' }, content: { type: 'string' }, isClue: { type: 'boolean' } }, required: ['id', 'type', 'title', 'content', 'isClue'] } },
    resolution: { type: 'object', additionalProperties: false, properties: { explanation: { type: 'string' } }, required: ['explanation'] },
  }, required: ['title', 'briefing', 'suspects', 'evidence', 'resolution'],
};

function publicCase(doc) {
  const c = doc.toObject ? doc.toObject() : doc;
  c.suspects = c.suspects.map(({ isCulprit, ...suspect }) => suspect);
  delete c.resolution;
  return c;
}

router.post('/generate', async (req, res, next) => {
  try {
    const { title = '', scenario, category, difficulty, tone, suspects: suspectCount = 4 } = req.body;
    if (typeof scenario !== 'string' || scenario.trim().length < 30 || scenario.length > 2000) return res.status(400).json({ message: 'Scenario must be between 30 and 2,000 characters.' });
    if (!categories.includes(category) || !difficulties.includes(difficulty)) return res.status(400).json({ message: 'Choose a valid category and difficulty.' });
    if (!Number.isInteger(suspectCount) || suspectCount < 3 || suspectCount > 6) return res.status(400).json({ message: 'Choose between 3 and 6 suspects.' });
    if (typeof tone !== 'string' || !tone.trim()) return res.status(400).json({ message: 'Choose an atmospheric tone.' });
    if (!openai) return res.status(503).json({ message: 'Case generation is unavailable. Configure OPENAI_API_KEY on the server.' });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_schema', json_schema: { name: 'mystery_case', strict: true, schema: outputSchema } },
      messages: [
        { role: 'system', content: 'You are a mystery case designer. Return a fair-play fictional investigation based on the premise. Make exactly the requested number of suspects with exactly one culprit. Evidence and timeline must support one logically defensible solution; include red herrings without contradictions. Keep all content fictional, safe, and concise. Include 6-10 varied evidence items and a satisfying spoiler explanation. For IMAGE_CCTV, describe the still image. For AUDIO, provide transcript and recording context.' },
        { role: 'user', content: JSON.stringify({ requestedTitle: title.trim(), scenario: scenario.trim(), category, difficulty, tone, suspectCount }) },
      ],
    });
    const generated = JSON.parse(completion.choices[0]?.message?.content || '{}');
    if (!Array.isArray(generated.suspects) || generated.suspects.length !== suspectCount || generated.suspects.filter(s => s.isCulprit).length !== 1 || !Array.isArray(generated.evidence) || generated.evidence.length < 4) {
      return res.status(502).json({ message: 'The generated case did not pass its consistency check. Please try again.' });
    }
    generated.suspects = generated.suspects.map((s, i) => ({ ...s, id: `suspect-${i + 1}` }));
    generated.evidence = generated.evidence.map((e, i) => ({ ...e, id: `evidence-${i + 1}` }));
    const record = await Case.create({ title: title.trim() || generated.title, scenarioPrompt: scenario.trim(), category, difficulty, tone, briefing: generated.briefing, suspects: generated.suspects, evidence: generated.evidence, resolution: { culpritId: generated.suspects.find(s => s.isCulprit).id, explanation: generated.resolution.explanation } });
    res.status(201).json({ caseId: record.id, case: publicCase(record) });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const record = await Case.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Case not found.' });
    res.json(publicCase(record));
  } catch (error) { next(error); }
});

router.post('/:id/accuse', async (req, res, next) => {
  try {
    const record = await Case.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Case not found.' });
    if (record.status !== 'ACTIVE') return res.status(409).json({ message: 'This case has already been resolved.' });
    const suspect = record.suspects.find(s => s.id === req.body.suspectId);
    if (!suspect) return res.status(400).json({ message: 'Choose a suspect from this case.' });
    const culprit = record.suspects.find(s => s.isCulprit);
    const solved = suspect.isCulprit;
    record.status = solved ? 'SOLVED' : 'FAILED';
    await record.save();
    res.json({ status: record.status, correct: solved, solution: { culprit: culprit.name, culpritId: culprit.id, explanation: record.resolution.explanation, evidence: record.evidence.filter(e => e.isClue).map(({ id, title, content }) => ({ id, title, content })) } });
  } catch (error) { next(error); }
});

export default router;
