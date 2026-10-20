# Fase 1 — Simulador WhatsApp como porta de entrada e gancho OmniRoute SDR

Data: 2026-10-20
Status: aprovado em conversa (arquitetura, componentes, fluxo)
Escopo: uma fatia de implementacao

## 1. Objetivo

Quando o usuario abre o site, a sessao **Simulador e Central de Atendimento WhatsApp Business API** e a porta de entrada. Cada mensagem do cliente e atendida por **Carol** (agente inteligente da conversa, com aprendizado por interacao). Em paralelo, a mesma mensagem e despachada no OmniRoute para o slot reservado do agente SDR/atendente futuro. O agente SDR completo, o handoff de agenda, as notificacoes e a gravacao em Analytics/Novo Paciente **nao** sao implementados nesta fatia.

## 2. Fora de escopo (contratos vazios)

As fatias abaixo existem apenas como metadata/contrato no codigo. Nao ha UI nova, API Google, nem persistencia CRM nesta entrega.

| Fase | Entrega | Dono futuro |
|------|---------|-------------|
| 2 | Agente SDR de captacao + skill de aprender a lidar com o cliente (voz propria no chat) | `agent_sdr` deixa de ser placeholder |
| 3 | Handoff para agente de horario + Google Agenda (dentistas e slots reais) | `agent_scheduler` + integracao Google Calendar |
| 4 | Notificacoes WhatsApp/SMS/e-mail (dentista e cliente); gravar em Agenda integrada, Analytics e Novo Paciente | pipeline pos-confirmacao de slot |

Nao reaplicar o stash `wip-whatsapp-meta-learning`. Nao substituir Carol no chat. Nao criar um segundo agente falando no WhatsApp.

## 3. Arquitetura

```
Abre o site
  --> App.tsx activeTab inicial = 'whatsapp'

Mensagem no Simulador
  --> POST /api/meta/chat-pipeline   (sincrono, dono da reply)
        Carol: triagem clinica, CRO/LGPD, slots, aprendizado
        --> UI do chat + telemetria + heuristica
  --> POST /api/omniroute/dispatch   (paralelo, fire-and-forget)
        channel: whatsapp
        agentId: agent_sdr
        metadata.slotStatus: reserved
        metadata.source: whatsapp_simulator
        metadata.phase: capture_hook
        --> historico OmniRoute apenas (sem texto no chat)
```

Regra de isolamento: falha, timeout ou 4xx/5xx do gancho OmniRoute **nao** altera a resposta da Carol nem o estado do chat.

## 4. Componentes e mudancas

### 4.1 `src/App.tsx`

- Trocar o estado inicial de `activeTab` de `'crm'` para `'whatsapp'`.
- Nao mudar persistencia de pacientes/agendamentos nesta fatia.
- Se no futuro um webhook inbound Meta chegar ao front, o mesmo `setActiveTab('whatsapp')` deve ser o foco. Nesta fatia nao ha listener de webhook no cliente; o default da aba ja cobre o caso "abrir o site".

### 4.2 `src/components/WhatsAppSimulator.tsx`

- `handleSendMessage` continua chamando `POST /api/meta/chat-pipeline` e aplicando `replyText`, `triage`, `learnedInsight` e heurísticas como hoje.
- Apos `data.success === true`, disparar o gancho **via** `omniRouteService.dispatchDemand` (nao um `fetch` solto). O Hub OmniRoute le o historico de `localStorage`; so o HTTP nao atualizaria a UI do Hub.
- Invocar sem bloquear a bolha da Carol: `void omniRouteService.dispatchDemand(...).catch(() => {})`.
- Parametros: `{ channel: 'whatsapp', rawInput: text, sourceUserName: 'Paciente', preferredAgentId: 'agent_sdr', slotStatus: 'reserved', source: 'whatsapp_simulator', phase: 'capture_hook' }` (estender a assinatura de `dispatchDemand` com esses campos opcionais; nao quebrar chamadas atuais do Hub).
- Timeout do gancho: 1500 ms dentro de `dispatchDemand` quando `slotStatus === 'reserved'` (`AbortController` no `fetch` interno).
- `catch` silencioso. Toast de telemetria e opcional e nao faz parte do criterio de pronto.
- Nao concatenar `agentOutput` do OmniRoute na lista `messages`.

### 4.3 `src/lib/omniRoute.ts` e `src/types/index.ts`

- Nao criar um agente novo. Reutilizar `agent_sdr` (`role: 'sdr_qualification'`).
- Estender `dispatchDemand` com campos opcionais `slotStatus`, `source`, `phase`. Chamadas atuais do OmniRouteHub permanecem validas.
- Quando `slotStatus === 'reserved'`, o `fetch` interno envia `context: { source, slotStatus, phase }` e persiste a demanda com:
  - `assignedAgentId: 'agent_sdr'`
  - `status: 'queued'` (nao `'completed'`: o agente ainda nao executa captacao)
  - `metadata.slotStatus: 'reserved'`
  - `metadata.phase: 'capture_hook'`
  - `metadata.source: 'whatsapp_simulator'`
- `agentOutput` vazio. Nao e mensagem de paciente. Se o fetch falhar no modo reserved, ainda persistir a demanda `queued` localmente (o gancho e registro, nao geracao).
- Comentario de contrato no objeto `agent_sdr`: slot reservado para o agente SDR/atendente futuro; Fase 2 ativa o agente; Fase 3 faz handoff para `agent_scheduler`; Fase 4 grava CRM/notificacoes.
- Tipos: preferir `OmniRouteDemand.metadata` ja existente. So alterar `src/types/index.ts` se a assinatura de `dispatchDemand` exigir um tipo exportado; caso contrario nao tocar o arquivo.

### 4.4 `server.ts` — `POST /api/omniroute/dispatch`

- Continuar aceitando `channel`, `input`, `agentId`, `sourceUserName`, `context`.
- Se `context.slotStatus === 'reserved'` **ou** `context.source === 'whatsapp_simulator'` com `phase: 'capture_hook'`:
  - nao chamar Gemini
  - nao gerar texto de atendimento
  - responder `{ success: true, hookAccepted: true, assignedAgentId: 'agent_sdr', status: 'queued', output: '' }`
- Demais chamadas ao dispatcher (OmniRouteHub, outros canais) permanecem com o comportamento atual (classificacao + geracao).

### 4.5 `server.ts` — `POST /api/meta/chat-pipeline`

- Sem mudanca de contrato de resposta (`replyText`, `triage`, `suggestedSlots`, `suggestedQuickReplies`, `learnedInsight`, `modelUsed`, `executionTimeMs`).
- Carol continua sendo o unico texto visivel no WhatsApp.
- Aprendizado existente permanece: `extractAdaptiveLearningInsight` + heurísticas no cliente (`brainState`).

## 5. Papel da Carol (nesta fatia)

Carol e o agente da conversa no Simulador:

- Responde de forma sensata (triagem, CRO 196/2019, LGPD, oferta de slots).
- Aprende a cada interacao via heurísticas ja existentes (`AgentBrainState`, `learnedInsight`).
- Nao e o agente SDR de captacao comercial (esse e o slot `agent_sdr`, ainda reserved).
- Nao e o agente de Google Agenda (`agent_scheduler`, Fase 3).

## 6. Tratamento de erros

| Falha | Comportamento |
|-------|----------------|
| `chat-pipeline` 4xx/5xx ou timeout | igual ao atual: sem bolha da Carol ou fallback local ja existente; gancho OmniRoute nao dispara se nao houver `success` |
| OmniRoute dispatch timeout (1.5s) / rede / 5xx | ignorar; chat inalterado |
| OmniRoute 400 (input vazio) | nao ocorre: gancho so dispara com texto ja validado |
| localStorage OmniRoute indisponivel | dispatcher HTTP ainda responde ack; historico no hub pode ficar vazio ate refresh com storage ok |

## 7. Testes manuais (criterio de pronto)

1. Abrir o site: aba ativa e a do Simulador WhatsApp (nao CRM).
2. Enviar mensagem de dor: Carol responde com acolhimento de urgencia; telemetria de triagem atualiza.
3. Enviar mensagem de preco: Carol nao da preco fechado (CRO); oferece check-up / slots.
4. Abrir OmniRoute Hub: historico mostra demanda `agent_sdr` com `slotStatus: reserved` e `status: queued` para as mensagens do passo 2/3.
5. Simular falha do dispatch (servidor OmniRoute parado ou abort): Carol ainda responde.
6. Carol apos varias mensagens: `brainState` / painel Cerebro incrementa conversas e registra insight (comportamento ja existente, nao regressao).

Nao ha suite automatizada obrigatoria nesta fatia. Se existir teste de smoke do front, nao quebrar.

## 8. Criterio de pronto

- Home inicial = aba `whatsapp`.
- Carol e a unica voz no chat e continua aprendendo.
- Cada mensagem bem-sucedida no pipeline gera um gancho `agent_sdr` reserved no OmniRoute.
- Falha do gancho nao quebra o atendimento.
- Codigo contem comentarios/contratos apontando Fases 2–4; nenhuma dessas fases e entregue.

## 9. Arquivos tocados

- `src/App.tsx`
- `src/components/WhatsAppSimulator.tsx`
- `src/lib/omniRoute.ts`
- `src/types/index.ts` (somente se metadata do contrato precisar de tipo explicito; preferir `OmniRouteDemand.metadata` ja existente)
- `server.ts` (`/api/omniroute/dispatch` apenas)

Arquivos explicitamente nao tocados para logica nova: `NewPatientModal.tsx`, `CrmAnalytics.tsx`, `SchedulingModule.tsx`, `SdrSocialHub.tsx`, `metaWebhook.ts` (alem de constantes ja existentes).
