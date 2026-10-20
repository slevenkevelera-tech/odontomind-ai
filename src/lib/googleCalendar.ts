import { Appointment, ClinicDentist, GoogleCalendarSyncStatus } from '../types';

export interface GoogleCalendarStatus {
  connected: boolean;
  mode: 'live' | 'local';
  message: string;
  calendars: { id: string; summary: string }[];
}

export interface GoogleSyncResult {
  success: boolean;
  status: GoogleCalendarSyncStatus;
  googleEventId?: string;
  googleHtmlLink?: string;
  message: string;
}

export async function fetchGoogleCalendarStatus(): Promise<GoogleCalendarStatus> {
  try {
    const res = await fetch('/api/calendar/status');
    if (!res.ok) throw new Error('status_failed');
    return await res.json();
  } catch {
    return {
      connected: false,
      mode: 'local',
      message: 'Agenda local ativa. Configure USER_GOOGLE_CALENDAR_TOKEN para sincronizar com o Google.',
      calendars: []
    };
  }
}

export async function syncAppointmentToGoogle(
  appointment: Appointment,
  dentist: ClinicDentist
): Promise<GoogleSyncResult> {
  try {
    const res = await fetch('/api/calendar/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment, dentist })
    });
    const data = await res.json();
    return {
      success: Boolean(data.success),
      status: data.status || (data.success ? 'synced' : 'pending'),
      googleEventId: data.googleEventId,
      googleHtmlLink: data.googleHtmlLink,
      message: data.message || 'Consulta registrada na agenda da clinica.'
    };
  } catch {
    return {
      success: false,
      status: 'local',
      message: 'Consulta salva no site. Google Calendar indisponivel no momento.'
    };
  }
}

export async function importGoogleEvents(dentist: ClinicDentist, date: string): Promise<Appointment[]> {
  try {
    const params = new URLSearchParams({
      dentistId: dentist.id,
      calendarId: dentist.calendarId,
      date
    });
    const res = await fetch(`/api/calendar/events?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.appointments) ? data.appointments : [];
  } catch {
    return [];
  }
}
