export type BookingSlot = {
  id: string;
  date: string;
  isoDate: string;
  time: string;
  period: string;
  dentist: string;
  dentistId: string;
  procedure: string;
  chair: string;
};

export type StoredBookingKey = {
  dentistId: string;
  date: string;
  time: string;
  patientName: string;
};

export type BookingAppointment = {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  durationMinutes: number;
  dentist: string;
  dentistId: string;
  procedure: string;
  status: 'confirmed';
  reminderSent: boolean;
  channel: 'whatsapp';
  googleCalendarId: string;
  googleSyncStatus: 'synced' | 'pending' | 'local' | 'error';
  googleEventId?: string;
  googleHtmlLink?: string;
};

const DENTISTS: Record<string, { id: string; name: string; calendarId: string }> = {
  'camila-alencar': {
    id: 'camila-alencar',
    name: 'Dra. Camila Alencar',
    calendarId: 'camila.alencar@odontomind.ai'
  },
  'lucas-sampaio': {
    id: 'lucas-sampaio',
    name: 'Dr. Lucas Sampaio',
    calendarId: 'lucas.sampaio@odontomind.ai'
  }
};

const INTENT_RE = /\b(quero|confirmo|confirma|pode ser|prefiro|agendar|encaixe|reservar)\b/i;

function toSaoPauloDate(base: Date): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(base);
  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const day = Number(parts.find((p) => p.type === 'day')?.value);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function isoDateOf(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatSlotDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC'
  });
}

function dentistOf(id: string) {
  return DENTISTS[id] || DENTISTS['camila-alencar'];
}

export function buildSuggestedSlots(now: Date, urgencyLevel: string): BookingSlot[] {
  const today = toSaoPauloDate(now);
  const tomorrow = addDays(today, 1);
  const pain = urgencyLevel === 'emergencia_dor';
  const postOp = urgencyLevel === 'pos_operatorio';
  const dentist = dentistOf(postOp ? 'lucas-sampaio' : 'camila-alencar');

  if (pain) {
    return [
      {
        id: 'slot-today',
        date: formatSlotDate(today),
        isoDate: isoDateOf(today),
        time: '14:30',
        period: 'Tarde',
        dentist: dentist.name,
        dentistId: dentist.id,
        procedure: 'Atendimento de Urgência & Alívio de Dor',
        chair: 'Cadeira 02 - Consultório Master'
      },
      {
        id: 'slot-tomorrow',
        date: formatSlotDate(today),
        isoDate: isoDateOf(today),
        time: '16:00',
        period: 'Tarde',
        dentist: dentist.name,
        dentistId: dentist.id,
        procedure: 'Atendimento de Urgência & Alívio de Dor',
        chair: 'Cadeira 02 - Consultório Master'
      }
    ];
  }

  const firstProcedure = postOp
    ? 'Retorno pós-operatório'
    : 'Check-up Digital com Scanner 3D';
  const secondProcedure = postOp
    ? 'Retorno pós-operatório'
    : 'Avaliação Individualizada & Escaneamento 3D';

  return [
    {
      id: 'slot-today',
      date: formatSlotDate(today),
      isoDate: isoDateOf(today),
      time: '16:00',
      period: 'Tarde',
      dentist: dentist.name,
      dentistId: dentist.id,
      procedure: firstProcedure,
      chair: postOp ? 'Cadeira 03 - Cirurgia' : 'Cadeira 02 - Consultório Master'
    },
    {
      id: 'slot-tomorrow',
      date: formatSlotDate(tomorrow),
      isoDate: isoDateOf(tomorrow),
      time: '10:30',
      period: 'Manhã',
      dentist: dentist.name,
      dentistId: dentist.id,
      procedure: secondProcedure,
      chair: postOp ? 'Cadeira 03 - Cirurgia' : 'Cadeira 01 - Scanner iTero'
    }
  ];
}

function normalizeTimeToken(raw: string): string | null {
  const compact = raw.replace(/\s/g, '').toLowerCase();
  if (/^14[:h]?30$/.test(compact) || compact === '14.30') return '14:30';
  if (/^16[:h]?00$/.test(compact) || compact === '16h' || compact === '16:00') return '16:00';
  if (/^10[:h]?30$/.test(compact) || compact === '10.30') return '10:30';
  return null;
}

function timesInMessage(message: string): string[] {
  const found: string[] = [];
  const re = /\b(\d{1,2}\s*[:h]\s*\d{2}|\d{1,2}\s*h)\b/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(message)) !== null) {
    const token = normalizeTimeToken(match[1]);
    if (token && !found.includes(token)) found.push(token);
  }
  return found;
}

export function matchConfirmedSlot(input: {
  message: string;
  confirmSlotId?: string;
  slots: BookingSlot[];
  now?: Date;
}): BookingSlot | null {
  const slots = input.slots || [];
  if (input.confirmSlotId) {
    const found = slots.find((slot) => slot.id === input.confirmSlotId);
    if (!found) return null;
    if (found.isoDate && found.dentistId) return found;
    const filled = [
      ...buildSuggestedSlots(input.now || new Date(), 'eletivo_estetica'),
      ...buildSuggestedSlots(input.now || new Date(), 'emergencia_dor'),
      ...buildSuggestedSlots(input.now || new Date(), 'pos_operatorio')
    ];
    const catalogHit = filled.find((slot) => slot.id === found.id && slot.time === found.time) || filled.find((slot) => slot.id === found.id);
    return catalogHit ? { ...catalogHit, ...found, isoDate: found.isoDate || catalogHit.isoDate, dentistId: found.dentistId || catalogHit.dentistId } : found;
  }

  const message = input.message || '';
  if (!INTENT_RE.test(message)) return null;

  const times = timesInMessage(message);
  if (times.length === 0) return null;

  const catalog = [
    ...slots,
    ...buildSuggestedSlots(input.now || new Date(), 'emergencia_dor'),
    ...buildSuggestedSlots(input.now || new Date(), 'pos_operatorio')
  ];
  const unique = catalog.filter(
    (slot, index) => catalog.findIndex((item) => item.isoDate === slot.isoDate && item.time === slot.time && item.dentistId === slot.dentistId) === index
  );

  const lower = message.toLowerCase();
  const wantsTomorrow = /\bamanh[ãa]\b/.test(lower);
  const wantsToday = /\bhoje\b/.test(lower);
  const byTime = unique.filter((slot) => times.includes(slot.time));
  if (byTime.length === 0) return null;

  if (/\b(lucas|retorno|cirurg)\b/i.test(lower)) {
    const lucas = byTime.find((slot) => slot.dentistId === 'lucas-sampaio');
    if (lucas) return lucas;
  }

  if (wantsTomorrow) {
    return byTime.find((slot) => slot.id === 'slot-tomorrow') || byTime[0];
  }
  if (wantsToday) {
    const todayIso = isoDateOf(toSaoPauloDate(input.now || new Date()));
    return byTime.find((slot) => slot.isoDate === todayIso && slot.time === times[0]) || byTime[0];
  }
  return byTime[0];
}

export function isDuplicateBooking(
  existing: StoredBookingKey[],
  candidate: StoredBookingKey
): boolean {
  return existing.some(
    (item) =>
      item.dentistId === candidate.dentistId &&
      item.date === candidate.date &&
      item.time === candidate.time &&
      item.patientName === candidate.patientName
  );
}

export function buildAppointmentFromSlot(input: {
  slot: BookingSlot;
  urgencyLevel: string;
  patientName: string;
  patientPhone: string;
}): BookingAppointment {
  const dentist = dentistOf(input.slot.dentistId);
  return {
    id: `apt-wa-${Date.now()}`,
    patientId: 'whatsapp-simulator',
    patientName: input.patientName || 'Paciente',
    patientPhone: input.patientPhone || '(11) 90000-0000',
    date: input.slot.isoDate,
    time: input.slot.time,
    durationMinutes: input.urgencyLevel === 'emergencia_dor' ? 30 : 60,
    dentist: dentist.name,
    dentistId: dentist.id,
    procedure: input.slot.procedure,
    status: 'confirmed',
    reminderSent: false,
    channel: 'whatsapp',
    googleCalendarId: dentist.calendarId,
    googleSyncStatus: 'pending'
  };
}

export function generateBookingReply(input: {
  slot: BookingSlot;
  patientName: string;
  duplicate: boolean;
}): string {
  const name = input.patientName && input.patientName !== 'Paciente' ? `${input.patientName}, ` : '';
  const shortName = input.slot.dentistId === 'lucas-sampaio' ? 'Lucas' : 'Camila';
  const article = input.slot.dentistId === 'lucas-sampaio' ? 'o Dr.' : 'a Dra.';
  if (input.duplicate) {
    return `${name}esse horário já está reservado: ${input.slot.date} às ${input.slot.time} com ${article} ${shortName}. Te espero na Av. Paulista.`;
  }
  return `${name}fechei ${input.slot.date} às ${input.slot.time} com ${article} ${shortName}. Endereço: Av. Paulista, 1842. Te mando o lembrete antes.`;
}
