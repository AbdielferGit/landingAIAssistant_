import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8');
const context = vm.createContext({ console });
vm.runInContext(source, context, { filename: 'Code.gs' });

const baseLead = {
  name: 'Marie Dupont',
  company: 'Exemple Inc.',
  email: 'marie@example.com',
  team_size: '11–50 personnes',
  challenge: 'Réduire le temps consacré aux rapports.',
  language: 'fr',
  consent: 'yes',
  utm_source: 'linkedin',
};

const lead = context.validatePublicLead_(baseLead);
assert.equal(lead.teamSize, '11–50');
assert.equal(lead.language, 'fr');
assert.equal(lead.source, 'linkedin');
assert.equal(lead.consent, true);

assert.equal(context.normalizeTeamSize_('More than 200 people'), '200+');
assert.equal(context.normalizeTeamSize_('1-10 personas'), '1–10');
assert.equal(context.normalizeLanguage_('DE'), 'fr');

assert.throws(
  () => context.validatePublicLead_({ ...baseLead, consent: '' }),
  /consentimiento/,
);
assert.throws(
  () => context.validatePublicLead_({ ...baseLead, email: 'not-an-email' }),
  /correo no es válido/,
);

console.log('CRM validation smoke tests passed');
