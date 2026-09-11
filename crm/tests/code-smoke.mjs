import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8');
const context = vm.createContext({ console });
vm.runInContext(source, context, { filename: 'Code.gs' });

const appointment = new Date();
appointment.setDate(appointment.getDate() + 7);
const appointmentDate = [
  appointment.getFullYear(),
  String(appointment.getMonth() + 1).padStart(2, '0'),
  String(appointment.getDate()).padStart(2, '0'),
].join('-');

const baseLead = {
  name: 'Marie Dupont',
  company: 'Exemple Inc.',
  email: 'marie@example.com',
  team_size: '11–50 personnes',
  challenge: 'Réduire le temps consacré aux rapports.',
  language: 'fr',
  consent: 'yes',
  appointment_date: appointmentDate,
  appointment_time: '10:30',
  utm_source: 'facebook',
  utm_medium: 'paid-social',
  utm_campaign: 'qc-smb-ai-diagnostic',
  utm_content: 'fr-reel-01',
};

const lead = context.validatePublicLead_(baseLead);
assert.equal(lead.teamSize, '11–50');
assert.equal(lead.language, 'fr');
assert.equal(lead.source, 'facebook');
assert.equal(lead.content, 'fr-reel-01');
assert.equal(lead.appointmentDate, appointmentDate);
assert.equal(lead.appointmentTime, '10:30');
assert.equal(lead.consent, true);
assert.match(context.appointmentNote_(lead), /Pendiente de confirmación/);
assert.match(context.appointmentNote_(lead), /fr-reel-01/);

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
assert.throws(
  () => context.validatePublicLead_({ ...baseLead, appointment_date: '' }),
  /fecha y hora/,
);
assert.throws(
  () => context.validatePublicLead_({ ...baseLead, appointment_time: '12:00' }),
  /hora seleccionada no está disponible/,
);

console.log('CRM validation smoke tests passed');
