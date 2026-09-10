import fs from 'node:fs';

const requiredFiles = ['index.html','styles.css','app.js','data/adgm.json'];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

const html = fs.readFileSync('index.html','utf8');
const js = fs.readFileSync('app.js','utf8');
const data = JSON.parse(fs.readFileSync('data/adgm.json','utf8'));

for (const asset of ['styles.css','app.js']) {
  if (!html.includes(asset)) throw new Error(`index.html does not reference ${asset}`);
}

const requiredViewIds = ['dashboard','formation','documents','review','vault','compliance'];
for (const id of requiredViewIds) {
  if (!html.includes(`id="${id}View"`)) throw new Error(`Missing view ${id}View`);
  if (!data.navigation.some(item => item.id === id)) throw new Error(`Missing navigation entry: ${id}`);
}

if (!Array.isArray(data.steps) || data.steps.length < 5) throw new Error('Formation workflow is unexpectedly incomplete');
if (!Array.isArray(data.documents) || data.documents.length === 0) throw new Error('Document checklist is empty');
if (!Array.isArray(data.compliance) || data.compliance.length === 0) throw new Error('Compliance calendar is empty');

const seen = new Set();
for (const step of data.steps) {
  if (!step.id || !step.title || !Array.isArray(step.fields)) throw new Error(`Invalid step: ${step.id || 'unknown'}`);
  for (const field of step.fields) {
    if (!field.id || !field.label || !field.type) throw new Error(`Invalid field in step ${step.id}`);
    if (seen.has(field.id)) throw new Error(`Duplicate field id: ${field.id}`);
    seen.add(field.id);
    if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length === 0)) {
      throw new Error(`Select field ${field.id} has no options`);
    }
  }
}

for (const requiredSnippet of ['DOMContentLoaded','localStorage','renderDashboard','renderWizard','renderDocuments','renderReview']) {
  if (!js.includes(requiredSnippet)) throw new Error(`app.js missing expected behavior: ${requiredSnippet}`);
}

console.log(`QA passed: ${data.steps.length} workflow sections, ${seen.size} fields, ${data.documents.length} document checks.`);
