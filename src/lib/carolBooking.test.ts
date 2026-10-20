import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSuggestedSlots,
  matchConfirmedSlot,
  isDuplicateBooking,
  buildAppointmentFromSlot,
  generateBookingReply
} from './carolBooking.ts';

const NOW = new Date('2026-10-20T15:00:00-03:00');

describe('buildSuggestedSlots', () => {
  it('offers Camila today 16:00 and tomorrow 10:30 for elective triage', () => {
    const slots = buildSuggestedSlots(NOW, 'eletivo_estetica');
    assert.equal(slots.length, 2);
    assert.equal(slots[0].id, 'slot-today');
    assert.equal(slots[0].isoDate, '2026-10-20');
    assert.equal(slots[0].time, '16:00');
    assert.equal(slots[0].dentistId, 'camila-alencar');
    assert.equal(slots[1].id, 'slot-tomorrow');
    assert.equal(slots[1].isoDate, '2026-10-21');
    assert.equal(slots[1].time, '10:30');
    assert.equal(slots[1].dentistId, 'camila-alencar');
  });

  it('offers Camila same-day 14:30 and 16:00 for acute pain', () => {
    const slots = buildSuggestedSlots(NOW, 'emergencia_dor');
    assert.equal(slots[0].isoDate, '2026-10-20');
    assert.equal(slots[0].time, '14:30');
    assert.equal(slots[0].dentistId, 'camila-alencar');
    assert.equal(slots[1].isoDate, '2026-10-20');
    assert.equal(slots[1].time, '16:00');
    assert.equal(slots[1].dentistId, 'camila-alencar');
  });

  it('offers Dr. Lucas for post-op slots', () => {
    const slots = buildSuggestedSlots(NOW, 'pos_operatorio');
    assert.equal(slots[0].time, '16:00');
    assert.equal(slots[0].dentistId, 'lucas-sampaio');
    assert.equal(slots[1].time, '10:30');
    assert.equal(slots[1].dentistId, 'lucas-sampaio');
  });
});

describe('matchConfirmedSlot', () => {
  const slots = buildSuggestedSlots(NOW, 'eletivo_estetica');

  it('does not book when the patient only mentions a time', () => {
    const match = matchConfirmedSlot({ message: 'vocês têm 16:00?', slots });
    assert.equal(match, null);
  });

  it('books when confirmSlotId matches an offered slot', () => {
    const match = matchConfirmedSlot({
      message: 'ok',
      confirmSlotId: 'slot-today',
      slots
    });
    assert.ok(match);
    assert.equal(match.time, '16:00');
    assert.equal(match.isoDate, '2026-10-20');
  });

  it('books when intent plus time match a quick reply', () => {
    const match = matchConfirmedSlot({
      message: 'Quero agendar hoje às 16h',
      slots
    });
    assert.ok(match);
    assert.equal(match.id, 'slot-today');
  });

  it('books tomorrow 10:30 from prefiro quick reply', () => {
    const match = matchConfirmedSlot({
      message: 'Prefiro amanhã às 10h30',
      slots
    });
    assert.ok(match);
    assert.equal(match.id, 'slot-tomorrow');
  });

  it('books 14:30 encaixe even if current slots are elective', () => {
    const match = matchConfirmedSlot({
      message: 'Quero o encaixe hoje às 14:30',
      slots,
      now: NOW
    });
    assert.ok(match);
    assert.equal(match.time, '14:30');
    assert.equal(match.dentistId, 'camila-alencar');
  });

  it('books Dr. Lucas when the patient prefers the post-op return', () => {
    const match = matchConfirmedSlot({
      message: 'Prefiro o retorno hoje às 16:00',
      slots,
      now: NOW
    });
    assert.ok(match);
    assert.equal(match.time, '16:00');
    assert.equal(match.dentistId, 'lucas-sampaio');
  });
});

describe('isDuplicateBooking', () => {
  it('detects the same dentist, day, time and patient', () => {
    const duplicate = isDuplicateBooking(
      [{ dentistId: 'camila-alencar', date: '2026-10-20', time: '16:00', patientName: 'Paciente' }],
      { dentistId: 'camila-alencar', date: '2026-10-20', time: '16:00', patientName: 'Paciente' }
    );
    assert.equal(duplicate, true);
  });

  it('allows a different time for the same patient', () => {
    const duplicate = isDuplicateBooking(
      [{ dentistId: 'camila-alencar', date: '2026-10-20', time: '16:00', patientName: 'Paciente' }],
      { dentistId: 'camila-alencar', date: '2026-10-20', time: '14:30', patientName: 'Paciente' }
    );
    assert.equal(duplicate, false);
  });
});

describe('buildAppointmentFromSlot', () => {
  it('uses 30 minutes for acute pain and 60 otherwise', () => {
    const painSlots = buildSuggestedSlots(NOW, 'emergencia_dor');
    const pain = buildAppointmentFromSlot({
      slot: painSlots[0],
      urgencyLevel: 'emergencia_dor',
      patientName: 'Paciente',
      patientPhone: '(11) 90000-0000'
    });
    assert.equal(pain.durationMinutes, 30);
    assert.equal(pain.status, 'confirmed');
    assert.equal(pain.channel, 'whatsapp');
    assert.equal(pain.date, '2026-10-20');
    assert.equal(pain.dentistId, 'camila-alencar');

    const elective = buildAppointmentFromSlot({
      slot: buildSuggestedSlots(NOW, 'duvida_geral')[0],
      urgencyLevel: 'duvida_geral',
      patientName: 'Paciente',
      patientPhone: '(11) 90000-0000'
    });
    assert.equal(elective.durationMinutes, 60);
  });
});

describe('generateBookingReply', () => {
  it('cites the closed time and does not offer another slot', () => {
    const slot = buildSuggestedSlots(NOW, 'eletivo_estetica')[0];
    const reply = generateBookingReply({ slot, patientName: 'Paciente', duplicate: false });
    assert.match(reply, /16:00/);
    assert.match(reply, /Camila/);
    assert.equal(/10:30/.test(reply), false);
  });
});
