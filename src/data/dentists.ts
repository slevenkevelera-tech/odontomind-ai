import { ClinicDentist } from '../types';

export const clinicDentists: ClinicDentist[] = [
  {
    id: 'camila-alencar',
    name: 'Dra. Camila Alencar',
    specialty: 'Ortodontia Digital e Estetica',
    cro: 'CRO-SP 89452',
    calendarId: 'camila.alencar@odontomind.ai',
    color: '#06b6d4'
  },
  {
    id: 'lucas-sampaio',
    name: 'Dr. Lucas Sampaio',
    specialty: 'Implantes e Cirurgia',
    cro: 'CRO-SP 71208',
    calendarId: 'lucas.sampaio@odontomind.ai',
    color: '#10b981'
  },
  {
    id: 'marcelo-ribeiro',
    name: 'Dr. Marcelo Ribeiro',
    specialty: 'Reabilitacao Oral',
    cro: 'CRO-SP 64019',
    calendarId: 'marcelo.ribeiro@odontomind.ai',
    color: '#8b5cf6'
  }
];

export function dentistIdFromName(name: string): string {
  const found = clinicDentists.find((d) => d.name === name);
  return found?.id || 'camila-alencar';
}

export function dentistFromId(id: string): ClinicDentist {
  return clinicDentists.find((d) => d.id === id) || clinicDentists[0];
}
