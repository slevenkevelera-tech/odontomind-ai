# Fase 3 (fatia) — Carol confirma horário no WhatsApp e grava no Google Calendar

Data: 2026-10-20
Status: aprovado em conversa (opção 2: confirmação no chat)
Escopo: uma fatia de implementação

## 1. Objetivo

A Carol continua dona do chat. Quando o paciente **aceita** um horário (botão Reservar, quick reply ou texto), o `POST /api/meta/chat-pipeline` cria a consulta no dentista certo e chama a sincronização já existente em `/api/calendar/sync`. Sem aceite, ela só faz triagem humana e oferece no máximo dois horários.

Gemini (`GEMINI_API_KEY`) já gera a voz. Google Calendar (`USER_GOOGLE_CALENDAR_TOKEN`) já grava eventos. Esta fatia **liga a confirmação da conversa a essa agenda**.

## 2. Fora de escopo

- Function calling do Gemini para listar/criar eventos (opção 3; depois).
- Agente SDR com voz própria no WhatsApp (`agent_sdr` permanece reserved).
- Segundo agente no chat (`agent_scheduler` não fala).
- Novo paciente no CRM / Analytics / SMS / e-mail (Fase 4).
- OAuth Google completo (consent screen, refresh token, calendários reais por e-mail). Continua o token opcional `USER_GOOGLE_CALENDAR_TOKEN`.
- Troca de modelo de IA. Continua `gemini-2.5-flash` com fallback `generateLocalWhatsAppReply`.
- Não reaplicar stash `wip-whatsapp-meta-learning`.

## 3. Arquitetura

```
Mensagem no Simulador (texto, quick reply ou botão Reservar)
  --> POST /api/meta/chat-pipeline
        1. triagem CRO/LGPD (já existe)
        2. se NÃO for aceite de slot: Gemini/fallback oferece 2 horários
        3. se FOR aceite: monta Appointment e chama helper `syncCalendarEvent`
           (mesmo código de /api/calendar/sync; Google se houver token; senão store local)
        --> replyText da Carol + triage + suggestedSlots + booking
  --> App registra a consulta no estado (sem segundo sync)
  --> OmniRoute dispatchDemand reserved (inalterado, paralelo)
```

Regra de isolamento: falha do Google não impede a confirmação no site nem a bolha da Carol. Falha do OmniRoute não altera booking nem chat.

## 4. Contrato de aceite

O pipeline trata como confirmação se **qualquer** item for verdadeiro:

1. Body traz `confirmSlotId` igual a um slot oferecido nesta conversa (`slot-today` ou `slot-tomorrow`).
2. Texto tem intenção de fechar **e** casa com um slot oferecido nesta resposta (`14:30`, `16:00`, `16h`, `10:30`, `10h30`, com ou sem `hoje` / `amanhã`). Intenção: `quero`, `confirmo`, `confirma`, `pode ser`, `prefiro`, `agendar`, `encaixe`, `reservar`. Só citar um horário sem verbo de aceite **não** agenda.
3. Quick replies atuais: `Quero o encaixe hoje às 14:30`, `Prefiro o retorno hoje às 16:00`, `Quero agendar hoje às 16h`, `Prefiro amanhã às 10h30`.
4. Clique em Reservar: o simulador envia a mensagem de confirmação **pelo mesmo** `handleSendMessage` (não mais `setTimeout` local).

Sem match: não cria evento. Carol continua a conversa e, se couber, reitera no máximo 2 slots.

Confirmação duplicada: o cliente não reenvia se `bookingConfirmedSlot === slot.id`. No server, se o store já tiver o mesmo `dentistId + isoDate + time + patientName`, não cria segundo evento; Carol só reafirma o já gravado.

## 5. Slots e dentista

Os slots de `chat-pipeline` passam a incluir data ISO e id do dentista, além dos campos visíveis atuais.

| Contexto de triagem | Slot 1 | Slot 2 | Dentista |
|---------------------|--------|--------|----------|
| `emergencia_dor` | hoje 14:30 (encaixe) | hoje 16:00 | Dra. Camila Alencar (`camila-alencar`) |
| `pos_operatorio` | hoje 16:00 | amanhã 10:30 | Dr. Lucas Sampaio (`lucas-sampaio`) |
| demais | hoje 16:00 | amanhã 10:30 | Dra. Camila Alencar (`camila-alencar`) |

Campos novos em cada slot: `isoDate` (`YYYY-MM-DD`, fuso `America/Sao_Paulo`), `time` (`HH:mm`), `dentistId`. `date` visível permanece `formatSlotDate` (ex.: `ter., 20/10`).

Duração: 30 min se `emergencia_dor`; 60 min nos demais. Procedimento: o texto já usado no slot (urgência, retorno, check-up 3D).

Paciente nesta fatia: nome `Paciente` (ou o `patientName` já enviado ao pipeline); telefone placeholder `(11) 90000-0000` se o simulador não enviar outro. Não abre `NewPatientModal`.

## 6. Componentes e mudanças

### 6.1 `server.ts` — `POST /api/meta/chat-pipeline`

- Continua dono de `replyText`.
- Detecta aceite **antes** de pedir texto ao Gemini quando `confirmSlotId` ou o texto casa com um slot.
- Confirmação: monta `Appointment` (`status: 'confirmed'`, `channel: 'whatsapp'`, `dentistId`, `googleCalendarId` do `clinicDentists` / mapa interno no server).
- Reutiliza a lógica de `/api/calendar/sync` (não duplicar o POST HTTP; extrair helper `syncCalendarEvent(appointment, dentist)` usado pelos dois endpoints).
- Resposta acrescenta `booking` (ausente ou `confirmed: false` se não houver aceite):

```
booking: {
  confirmed: true,
  appointment: { ...Appointment },
  googleSyncStatus: 'synced' | 'pending' | 'local',
  googleHtmlLink?: string,
  message: string
}
```

- Sem aceite: `booking` omitido ou `{ confirmed: false }`. `suggestedSlots` iguais aos de hoje, com `isoDate` e `dentistId`.
- Prompt Gemini, se ainda for gerar texto: se `booking.confirmed`, instruir que o horário já está reservado; citar data, hora e dentista; não oferecer outro slot. Sem booking, regra atual (no máximo 2 horários, sem preço fechado).
- Fallback local: nova variante de `generateLocalWhatsAppReply` (ou função irmã) para confirmação, citando o horário fechado. Sem Gemini a consulta **ainda é gravada**.

### 6.2 `src/components/WhatsAppSimulator.tsx`

- Nova prop opcional `onAddAppointment?: (appointment: Appointment) => void`.
- `handleConfirmSlot(slot)` deixa de inventar a bolha da Carol. Envia pelo pipeline, por exemplo: `Quero confirmar o horário de ${slot.time} (${slot.date})` **e** `confirmSlotId: slot.id` no body.
- `handleSendMessage` passa `confirmSlotId` quando o clique foi em um slot; senão só o texto.
- Se `data.booking?.confirmed` e `data.booking.appointment`: `setBookingConfirmedSlot`, chama `onAddAppointment(appointment)` uma vez, toast de sucesso (título de cadeira reservada; se `googleSyncStatus === 'synced'` mencionar Google).
- Botões Reservar já confirmados ficam desabilitados / selo Confirmado (comportamento visual atual).

### 6.3 `src/App.tsx`

- Passar para o simulador um registro que **não** dispare segundo `syncAppointmentToGoogle` se o appointment já vier com `googleSyncStatus` do servidor.
- Recomendação: em `handleAddAppointment`, se `googleSyncStatus` já for `synced` | `local` | `pending`, só inserir no estado e toast; não chamar `syncAppointmentToGoogle` de novo.
- `WhatsAppSimulator` recebe essa função. Agenda Integrada passa a listar a consulta da Carol.

### 6.4 Tipos

- `ClinicalTriageEvaluation.suggestedSlots` e `ChatMessage.interactiveBooking.slots`: adicionar `isoDate?: string` e `dentistId?: string`.
- Não criar tipo novo de agente. Não mudar OmniRoute.

### 6.5 `src/lib/googleCalendar.ts` e `SchedulingModule.tsx`

- Sem mudança de contrato. O módulo já lê `appointments` do App e já mostra status Google.

### 6.6 Chaves (documentação, sem valores reais)

- `GEMINI_API_KEY`: [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Sem chave, Carol usa fallback e ainda agenda no store local.
- `USER_GOOGLE_CALENDAR_TOKEN`: Bearer da Calendar API v3 (`calendar.events` no calendário alvo). Sem token, `mode: local` como hoje. Não ler chaves do ambiente do Agent. `.env.example` já tem o placeholder.

## 7. Tratamento de erros

| Falha | Comportamento |
|-------|----------------|
| Sem `GEMINI_API_KEY` ou timeout 20s | fallback local; se houver aceite, booking ainda grava |
| Sem `USER_GOOGLE_CALENDAR_TOKEN` | store `data/calendar-events.json`; `googleSyncStatus: 'local'`; Carol confirma no site |
| Google 4xx/5xx | `pending`; consulta no site; Carol confirma e não culpa o paciente |
| `chat-pipeline` 5xx | igual ao atual: bolha de fallback do cliente; sem appointment |
| OmniRoute falha | inalterado; não desfaz booking |
| Clique duplo Reservar | um evento; segunda resposta só reafirma |

## 8. Testes manuais (critério de pronto)

1. Mensagem de dúvida sem horário: Carol responde; nenhum item novo na Agenda Integrada.
2. Quick reply `Quero agendar hoje às 16h` (ou equivalente): consulta aparece na Agenda com Dra. Camila, hoje 16:00; Carol confirma no chat.
3. Botão Reservar no card do slot: mesmo efeito, via pipeline (não texto inventado no `setTimeout`).
4. Mensagem de dor + `Quero o encaixe hoje às 14:30`: Camila, 14:30, 30 min.
5. Pós-operatório + `Prefiro o retorno hoje às 16:00`: Dr. Lucas.
6. Sem token Google: status `local`; Carol mesmo assim confirma.
7. Com token válido: `synced` e `googleHtmlLink` quando a API aceitar.
8. Segundo clique no mesmo slot: sem duplicar evento.
9. OmniRoute: gancho `agent_sdr` reserved continua após mensagem bem-sucedida.
10. Carol é a única voz no WhatsApp.

## 9. Critério de pronto

- Aceite de slot no simulador grava `Appointment` no estado da Agenda.
- Sync Google reutiliza `/api/calendar/sync` (live ou local).
- Sem aceite, nenhum evento.
- Gemini continua opcional para a voz; booking não depende dele.
- Layout/header desta sessão não entra nesta fatia.

## 10. Arquivos tocados

- `server.ts` (`chat-pipeline` + helper compartilhado com calendar sync)
- `src/components/WhatsAppSimulator.tsx`
- `src/App.tsx` (prop + skip de segundo sync)
- `src/types/index.ts` (`isoDate`, `dentistId` nos slots)

Não tocar para lógica nova: `omniRoute.ts`, `NewPatientModal.tsx`, `CrmAnalytics.tsx`, `SdrSocialHub.tsx`, fluxo Meta outbound de `confirmAppointmentBooking` (fica legado; o caminho real é o pipeline).
