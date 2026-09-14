const CRM = Object.freeze({
  sheets: Object.freeze({ leads: 'Prospectos', activity: 'Actividad' }),
  properties: Object.freeze({
    spreadsheetId: 'CRM_SPREADSHEET_ID',
    contactEmail: 'CRM_CONTACT_EMAIL',
    adminToken: 'CRM_ADMIN_TOKEN',
    leadsSheetName: 'CRM_LEADS_SHEET_NAME',
  }),
  statuses: Object.freeze(['Nuevo', 'Contactado', 'Calificado', 'Propuesta', 'Ganado', 'Perdido']),
  activityTypes: Object.freeze(['Nota', 'Correo', 'Llamada', 'Reunión', 'Cambio de estado']),
  teamSizes: Object.freeze(['1–10', '11–50', '51–200', '200+']),
  leadColumns: 18,
  activityColumns: 6,
  maxLeads: 500,
  maxActivities: 150,
});

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('AiAssistant CRM')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function doPost(event) {
  try {
    const payload = parsePayload_(event);

    if (clean_(payload.website, 200)) {
      return json_({ ok: true });
    }

    const lead = validatePublicLead_(payload);
    const duplicateKey = duplicateKey_(lead);
    const cache = CacheService.getScriptCache();
    const cachedLeadId = cache.get(duplicateKey);

    if (cachedLeadId) {
      return json_({ ok: true, leadId: cachedLeadId, duplicate: true });
    }

    const result = withScriptLock_(function () {
      const leadId = createId_('LEAD');
      const now = new Date();
      const appointmentDate = parseAppointmentDate_(lead.appointmentDate);
      const appointmentNote = appointmentNote_(lead);
      appendLead_([
        leadId,
        now,
        now,
        lead.name,
        lead.company,
        lead.email,
        lead.teamSize,
        lead.challenge,
        lead.language,
        'Calificado',
        '',
        appointmentDate,
        lead.source,
        lead.medium,
        lead.campaign,
        lead.landingUrl,
        lead.consent ? 'Sí' : 'No',
        appointmentNote,
      ]);

      appendActivity_([
        createId_('ACT'),
        leadId,
        now,
        'Reunión',
        appointmentNote,
        'Landing page',
      ]);

      return { leadId: leadId, now: now };
    });

    cache.put(duplicateKey, result.leadId, 600);

    let notificationSent = true;
    try {
      sendLeadNotification_(lead, result.leadId, result.now);
    } catch (error) {
      notificationSent = false;
      console.error('Lead saved, but email notification failed', error);
    }

    return json_({ ok: true, leadId: result.leadId, notificationSent: notificationSent });
  } catch (error) {
    console.error('Lead intake failed', error);
    return json_({ ok: false, error: publicError_(error) });
  }
}

function initializeCrm() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error('Abre Apps Script desde la hoja AiAssistant CRM y vuelve a ejecutar initializeCrm.');
  }

  const properties = PropertiesService.getScriptProperties();
  const contactEmail = properties.getProperty(CRM.properties.contactEmail);
  if (!contactEmail) {
    throw new Error('Configura primero la propiedad privada CRM_CONTACT_EMAIL en Apps Script.');
  }
  let token = properties.getProperty(CRM.properties.adminToken);
  if (!token) {
    token = createSecureToken_();
  }

  properties.setProperties({
    CRM_SPREADSHEET_ID: active.getId(),
    CRM_ADMIN_TOKEN: token,
  });

  validateWorkbook_(active);
  console.log('CRM configurado. Guarda este token de administración en un gestor de contraseñas: ' + token);

  return {
    spreadsheetId: active.getId(),
    contactEmail: contactEmail,
    adminToken: token,
  };
}

function getDashboardData(adminToken) {
  assertAdmin_(adminToken);

  const spreadsheet = getSpreadsheet_();
  const leadsSheet = spreadsheet.getSheetByName(getLeadsSheetName_());
  const activitySheet = spreadsheet.getSheetByName(CRM.sheets.activity);
  const leads = readRows_(leadsSheet, CRM.leadColumns, CRM.maxLeads)
    .filter(function (row) { return row[0]; })
    .map(leadFromRow_)
    .sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
  const activities = readRows_(activitySheet, CRM.activityColumns, CRM.maxActivities)
    .filter(function (row) { return row[0]; })
    .map(activityFromRow_)
    .sort(function (a, b) { return b.timestamp.localeCompare(a.timestamp); });

  const counts = CRM.statuses.reduce(function (result, status) {
    result[status] = 0;
    return result;
  }, {});

  leads.forEach(function (lead) {
    if (Object.prototype.hasOwnProperty.call(counts, lead.status)) {
      counts[lead.status] += 1;
    }
  });

  return {
    leads: leads,
    activities: activities,
    metrics: {
      total: leads.length,
      newLeads: counts.Nuevo,
      qualified: counts.Calificado,
      won: counts.Ganado,
      conversion: leads.length ? Math.round((counts.Ganado / leads.length) * 1000) / 10 : 0,
      byStatus: counts,
    },
    options: {
      statuses: CRM.statuses,
      activityTypes: CRM.activityTypes,
    },
    contactEmail: getContactEmail_(),
    spreadsheetUrl: spreadsheet.getUrl(),
    generatedAt: new Date().toISOString(),
  };
}

function updateLead(adminToken, input) {
  assertAdmin_(adminToken);
  if (!input || !clean_(input.id, 80)) {
    throw new Error('Selecciona un prospecto válido.');
  }

  return withScriptLock_(function () {
    const sheet = getSpreadsheet_().getSheetByName(getLeadsSheetName_());
    const rowNumber = findRowById_(sheet, input.id);
    const range = sheet.getRange(rowNumber, 1, 1, CRM.leadColumns);
    const values = range.getValues()[0];
    const previousStatus = String(values[9] || 'Nuevo');
    const nextStatus = clean_(input.status, 40) || previousStatus;

    if (CRM.statuses.indexOf(nextStatus) === -1) {
      throw new Error('El estado seleccionado no es válido.');
    }

    values[2] = new Date();
    values[9] = nextStatus;
    values[10] = clean_(input.owner, 120);
    values[11] = parseDateInput_(input.nextFollowUp);
    values[17] = clean_(input.lastNote, 2000);
    range.setValues([values]);

    const changes = [];
    if (previousStatus !== nextStatus) {
      changes.push('Estado: ' + previousStatus + ' → ' + nextStatus);
    }
    if (values[17]) {
      changes.push('Nota: ' + values[17]);
    }
    if (!changes.length) {
      changes.push('Datos de seguimiento actualizados');
    }

    appendActivity_([
      createId_('ACT'),
      String(values[0]),
      new Date(),
      previousStatus !== nextStatus ? 'Cambio de estado' : 'Nota',
      changes.join('\n'),
      clean_(input.actor, 160) || getContactEmail_(),
    ]);

    return leadFromRow_(values);
  });
}

function addActivity(adminToken, input) {
  assertAdmin_(adminToken);
  if (!input || !clean_(input.leadId, 80)) {
    throw new Error('Selecciona un prospecto válido.');
  }

  const type = clean_(input.type, 50) || 'Nota';
  if (CRM.activityTypes.indexOf(type) === -1) {
    throw new Error('El tipo de actividad no es válido.');
  }

  const details = clean_(input.details, 3000);
  if (!details) {
    throw new Error('Escribe un detalle para la actividad.');
  }

  return withScriptLock_(function () {
    const spreadsheet = getSpreadsheet_();
    findRowById_(spreadsheet.getSheetByName(getLeadsSheetName_()), input.leadId);
    const row = [
      createId_('ACT'),
      clean_(input.leadId, 80),
      new Date(),
      type,
      details,
      clean_(input.actor, 160) || getContactEmail_(),
    ];
    appendActivity_(row);
    return activityFromRow_(row);
  });
}

function parsePayload_(event) {
  if (!event) return {};
  const contents = event.postData && event.postData.contents;
  if (contents) {
    try {
      return JSON.parse(contents);
    } catch (error) {
      // Fall through to form-encoded parameters.
    }
  }
  return event.parameter || {};
}

function validatePublicLead_(payload) {
  const lead = {
    name: clean_(payload.name, 160),
    company: clean_(payload.company, 200),
    email: clean_(payload.email, 254).toLowerCase(),
    teamSize: normalizeTeamSize_(payload.team_size || payload.teamSize),
    challenge: clean_(payload.challenge, 3000),
    language: normalizeLanguage_(payload.language),
    source: clean_(payload.utm_source || payload.source, 160),
    medium: clean_(payload.utm_medium || payload.medium, 160),
    campaign: clean_(payload.utm_campaign || payload.campaign, 200),
    content: clean_(payload.utm_content || payload.content, 200),
    offer: normalizeOffer_(payload.offer),
    landingUrl: clean_(payload.landing_url || payload.landingUrl, 600),
    appointmentDate: normalizeAppointmentDate_(payload.appointment_date || payload.appointmentDate),
    appointmentTime: normalizeAppointmentTime_(payload.appointment_time || payload.appointmentTime),
    consent: isTrue_(payload.consent),
  };

  if (!lead.name || !lead.company || !lead.email || !lead.challenge) {
    throw new Error('Faltan datos obligatorios.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    throw new Error('El correo no es válido.');
  }
  if (!lead.teamSize) {
    throw new Error('Selecciona el tamaño del equipo.');
  }
  if (!lead.appointmentDate || !lead.appointmentTime) {
    throw new Error('Selecciona una fecha y hora para la cita.');
  }
  if (!lead.consent) {
    throw new Error('Se requiere consentimiento para registrar la solicitud.');
  }

  return lead;
}

function normalizeTeamSize_(value) {
  const normalized = clean_(value, 80).toLowerCase();
  if (!normalized) return '';
  if (normalized.indexOf('1–10') !== -1 || normalized.indexOf('1-10') !== -1) return '1–10';
  if (normalized.indexOf('11–50') !== -1 || normalized.indexOf('11-50') !== -1) return '11–50';
  if (normalized.indexOf('51–200') !== -1 || normalized.indexOf('51-200') !== -1) return '51–200';
  if (normalized.indexOf('200') !== -1) return '200+';
  return CRM.teamSizes.indexOf(value) >= 0 ? value : '';
}

function normalizeLanguage_(value) {
  const language = clean_(value, 10).toLowerCase();
  return ['fr', 'en', 'es'].indexOf(language) >= 0 ? language : 'fr';
}

function normalizeOffer_(value) {
  const offer = clean_(value, 80).toLowerCase();
  return offer === 'ai-ready-website' ? 'ai-ready-website' : 'ai-adoption';
}

function normalizeAppointmentDate_(value) {
  const text = clean_(value, 20);
  if (!text) return '';
  parseAppointmentDate_(text);
  return text;
}

function normalizeAppointmentTime_(value) {
  const time = clean_(value, 10);
  const available = ['09:00', '10:30', '13:30', '15:00', '16:30'];
  if (!time) return '';
  if (available.indexOf(time) < 0) {
    throw new Error('La hora seleccionada no está disponible.');
  }
  return time;
}

function appointmentNote_(lead) {
  const source = [lead.source, lead.medium, lead.campaign].filter(Boolean).join(' / ') || 'Directo';
  const offer = lead.offer === 'ai-ready-website' ? 'Sitio web preparado para IA' : 'Adopción de IA';
  const lines = [
    'Servicio: ' + offer,
    'Cita solicitada para ' + lead.appointmentDate + ' a las ' + lead.appointmentTime + ' (America/Toronto). Pendiente de confirmación.',
    'Fuente: ' + source,
  ];
  if (lead.content) lines.push('Contenido: ' + lead.content);
  return lines.join('\n');
}

function appendLead_(row) {
  const sheet = getSpreadsheet_().getSheetByName(getLeadsSheetName_());
  appendTemplateRow_(sheet, row, CRM.leadColumns);
}

function appendActivity_(row) {
  const sheet = getSpreadsheet_().getSheetByName(CRM.sheets.activity);
  appendTemplateRow_(sheet, row, CRM.activityColumns);
}

function appendTemplateRow_(sheet, row, columnCount) {
  if (!sheet) throw new Error('No se encontró la hoja requerida.');
  const hasEmptyTemplate = sheet.getLastRow() === 2 && !sheet.getRange(2, 1).getValue();
  const targetRow = hasEmptyTemplate ? 2 : sheet.getLastRow() + 1;

  if (targetRow > 2) {
    const source = sheet.getRange(2, 1, 1, columnCount);
    const destination = sheet.getRange(targetRow, 1, 1, columnCount);
    source.copyTo(destination, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
    source.copyTo(destination, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
  }

  sheet.getRange(targetRow, 1, 1, columnCount).setValues([row]);
}

function readRows_(sheet, columnCount, maxRows) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const available = sheet.getLastRow() - 1;
  const count = Math.min(available, maxRows);
  return sheet.getRange(2, 1, count, columnCount).getValues();
}

function leadFromRow_(row) {
  return {
    id: text_(row[0]),
    createdAt: iso_(row[1]),
    updatedAt: iso_(row[2]),
    name: text_(row[3]),
    company: text_(row[4]),
    email: text_(row[5]),
    teamSize: text_(row[6]),
    challenge: text_(row[7]),
    language: text_(row[8]),
    status: text_(row[9]) || 'Nuevo',
    owner: text_(row[10]),
    nextFollowUp: dateInput_(row[11]),
    source: text_(row[12]),
    medium: text_(row[13]),
    campaign: text_(row[14]),
    landingUrl: text_(row[15]),
    consent: text_(row[16]),
    lastNote: text_(row[17]),
  };
}

function activityFromRow_(row) {
  return {
    id: text_(row[0]),
    leadId: text_(row[1]),
    timestamp: iso_(row[2]),
    type: text_(row[3]),
    details: text_(row[4]),
    actor: text_(row[5]),
  };
}

function findRowById_(sheet, id) {
  if (!sheet || sheet.getLastRow() < 2) throw new Error('No se encontró el prospecto.');
  const finder = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(String(id))
    .matchEntireCell(true)
    .findNext();
  if (!finder) throw new Error('No se encontró el prospecto.');
  return finder.getRow();
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty(CRM.properties.spreadsheetId);
  if (!id) throw new Error('El CRM todavía no está configurado. Ejecuta initializeCrm.');
  return SpreadsheetApp.openById(id);
}

function getContactEmail_() {
  const email = PropertiesService.getScriptProperties().getProperty(CRM.properties.contactEmail);
  if (!email) throw new Error('El correo de contacto no está configurado.');
  return email;
}

function getLeadsSheetName_() {
  return PropertiesService.getScriptProperties().getProperty(CRM.properties.leadsSheetName) || CRM.sheets.leads;
}

function validateWorkbook_(spreadsheet) {
  const leadsSheetName = getLeadsSheetName_();
  const leads = spreadsheet.getSheetByName(leadsSheetName);
  const activity = spreadsheet.getSheetByName(CRM.sheets.activity);
  if (!leads || !activity) {
    throw new Error('La hoja debe contener las pestañas ' + leadsSheetName + ' y Actividad.');
  }
}

function assertAdmin_(token) {
  const expected = PropertiesService.getScriptProperties().getProperty(CRM.properties.adminToken);
  if (!expected || !token || !safeEquals_(expected, String(token))) {
    throw new Error('Acceso no autorizado.');
  }
}

function safeEquals_(left, right) {
  const leftDigest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, left, Utilities.Charset.UTF_8);
  const rightDigest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, right, Utilities.Charset.UTF_8);
  if (leftDigest.length !== rightDigest.length) return false;
  let difference = 0;
  for (let index = 0; index < leftDigest.length; index += 1) {
    difference |= leftDigest[index] ^ rightDigest[index];
  }
  return difference === 0;
}

function withScriptLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function sendLeadNotification_(lead, leadId, createdAt) {
  const source = [lead.source, lead.medium, lead.campaign].filter(Boolean).join(' / ') || 'Directo';
  const offer = lead.offer === 'ai-ready-website' ? 'Sitio web preparado para IA' : 'Adopción de IA';
  const subject = 'Nueva cita AiAssistant · ' + offer + ': ' + lead.company + ' · ' + lead.appointmentDate;
  const body = [
    'Nueva solicitud de cita registrada',
    '',
    'ID: ' + leadId,
    'Fecha de registro: ' + iso_(createdAt),
    'Nombre: ' + lead.name,
    'Empresa: ' + lead.company,
    'Email: ' + lead.email,
    'Tamaño del equipo: ' + lead.teamSize,
    'Idioma: ' + lead.language,
    'Servicio: ' + offer,
    'Fuente: ' + source,
    'Contenido: ' + (lead.content || 'No identificado'),
    'Cita solicitada: ' + lead.appointmentDate + ' a las ' + lead.appointmentTime + ' (hora de Montreal)',
    'Estado: pendiente de confirmación',
    '',
    'Desafío:',
    lead.challenge,
  ].join('\n');

  const html = [
    '<div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.55">',
    '<h2 style="margin:0 0 16px">Nueva solicitud de cita AiAssistant</h2>',
    '<p><strong>ID:</strong> ' + escapeHtml_(leadId) + '<br>',
    '<strong>Fecha:</strong> ' + escapeHtml_(iso_(createdAt)) + '<br>',
    '<strong>Nombre:</strong> ' + escapeHtml_(lead.name) + '<br>',
    '<strong>Empresa:</strong> ' + escapeHtml_(lead.company) + '<br>',
    '<strong>Email:</strong> <a href="mailto:' + escapeHtml_(lead.email) + '">' + escapeHtml_(lead.email) + '</a><br>',
    '<strong>Tamaño del equipo:</strong> ' + escapeHtml_(lead.teamSize) + '<br>',
    '<strong>Idioma:</strong> ' + escapeHtml_(lead.language) + '<br>',
    '<strong>Servicio:</strong> ' + escapeHtml_(offer) + '<br>',
    '<strong>Fuente:</strong> ' + escapeHtml_(source) + '<br>',
    '<strong>Contenido:</strong> ' + escapeHtml_(lead.content || 'No identificado') + '</p>',
    '<p style="padding:14px 16px;background:#f0f3ff;border-radius:10px"><strong>Cita solicitada</strong><br>' + escapeHtml_(lead.appointmentDate) + ' a las ' + escapeHtml_(lead.appointmentTime) + ' (hora de Montreal)<br><em>Pendiente de confirmación</em></p>',
    '<p><strong>Desafío</strong><br>' + escapeHtml_(lead.challenge).replace(/\n/g, '<br>') + '</p>',
    '</div>',
  ].join('');

  MailApp.sendEmail({
    to: getContactEmail_(),
    subject: subject,
    body: body,
    htmlBody: html,
    replyTo: lead.email,
    name: 'AiAssistant CRM',
  });
}

function duplicateKey_(lead) {
  const raw = [lead.email, lead.company, lead.offer, lead.appointmentDate, lead.appointmentTime, lead.challenge.slice(0, 200)].join('|').toLowerCase();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);
  return 'lead-' + Utilities.base64EncodeWebSafe(digest).slice(0, 40);
}

function createId_(prefix) {
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  return prefix + '-' + date + '-' + Utilities.getUuid().replace(/-/g, '').slice(0, 10).toUpperCase();
}

function createSecureToken_() {
  const raw = Utilities.getUuid() + Utilities.getUuid() + new Date().getTime();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);
  return Utilities.base64EncodeWebSafe(digest).replace(/=+$/g, '');
}

function parseDateInput_(value) {
  const text = clean_(value, 20);
  if (!text) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) throw new Error('La fecha de seguimiento no es válida.');
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0);
}

function parseAppointmentDate_(value) {
  const text = clean_(value, 20);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) throw new Error('La fecha de la cita no es válida.');

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const appointment = new Date(year, month - 1, day, 12, 0, 0);
  if (appointment.getFullYear() !== year || appointment.getMonth() !== month - 1 || appointment.getDate() !== day) {
    throw new Error('La fecha de la cita no es válida.');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const latest = new Date(today);
  latest.setDate(latest.getDate() + 90);
  latest.setHours(23, 59, 59, 999);
  if (appointment <= today || appointment > latest) {
    throw new Error('La fecha de la cita debe estar entre mañana y los próximos 90 días.');
  }
  return appointment;
}

function dateInput_(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return '';
  return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function iso_(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  return value ? String(value) : '';
}

function isTrue_(value) {
  return ['true', '1', 'yes', 'si', 'sí', 'on'].indexOf(String(value || '').toLowerCase()) >= 0;
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, maxLength);
}

function text_(value) {
  return value == null ? '' : String(value);
}

function escapeHtml_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function publicError_(error) {
  const message = error && error.message ? String(error.message) : 'No se pudo registrar la solicitud.';
  const allowed = [
    'Faltan datos obligatorios.',
    'El correo no es válido.',
    'Selecciona el tamaño del equipo.',
    'Selecciona una fecha y hora para la cita.',
    'La fecha de la cita no es válida.',
    'La fecha de la cita debe estar entre mañana y los próximos 90 días.',
    'La hora seleccionada no está disponible.',
    'Se requiere consentimiento para registrar la solicitud.',
    'El CRM todavía no está configurado. Ejecuta initializeCrm.',
  ];
  return allowed.indexOf(message) >= 0 ? message : 'No se pudo registrar la solicitud.';
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
