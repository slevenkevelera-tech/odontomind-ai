# Plano de integração — OdontoMind AI + ECC Loops Digital

**Status:** proposta técnica para revisão. Este documento não altera o comportamento da aplicação.
**Produção:** nenhuma alteração de produção autorizada ou realizada.
**Política editorial:** publicação exige aprovação humana.

## 1. Objetivo

Manter a OdontoMind AI como aplicação especializada em odontologia e expor uma API de integração segura ao ECC Loops Digital. O ECC coordena tarefas e aprovações; a OdontoMind oferece capacidades especializadas, sem expor rotas clínicas ou credenciais administrativas.

## 2. Estado observado na auditoria estática

- Backend Express/TypeScript com rotas de IA, automação, webhook e calendário.
- A configuração usa variáveis de ambiente para credenciais, documentadas em `.env.example`.
- Parte do estado do calendário é persistida em arquivo local.
- Foram encontradas rotas com resultados simulados e uma operação Git privilegiada que aceita parâmetros de requisição e usa `git push --force`.
- O código consultado inclui um valor padrão para verificação de webhook e registra o token recebido na query string.
- Algumas rotas operacionais não mostram autenticação/autorização no handler analisado.

Os achados precisam ser confirmados com testes e configuração de ambiente. Não se reproduzem aqui quaisquer valores de segredos.

## 3. Bloqueadores de segurança

1. Desabilitar ou proteger a rota privilegiada de push ao GitHub antes de disponibilizar o endpoint a tráfego não confiável.
2. Remover a execução de shell interpolada a partir de dados recebidos; preferir APIs e argumentos fixos/validados. Remover `--force` do fluxo normal.
3. Remover fallback de token de webhook e o registro de tokens em logs. Rotacionar qualquer credencial que possa ter sido exposta em histórico/logs.
4. Adicionar autenticação e autorização para endpoints de escrita, calendário, tarefas e integrações.
5. Validar payloads e impor limites de tamanho/taxa/tempo.
6. Restringir CORS a origens autorizadas quando aplicável.
7. Evitar registrar dados clínicos, informações de pacientes, tokens ou payloads completos.
8. Separar segredos de staging e produção; privilégios mínimos e rotação.
9. Não usar dados reais de pacientes em testes iniciais.

## 4. API de integração proposta

- `POST /api/integrations/ecc/tasks`: aceitar tarefas permitidas do ECC.
- `GET /api/integrations/ecc/tasks/:id`: consultar status autorizado.
- `POST /api/content/drafts`: gerar ou armazenar rascunho editorial.
- `GET /api/content/drafts/:id`: recuperar conteúdo autorizado.
- `POST /api/content/drafts/:id/review-result`: registrar resultado da revisão externa, sem aprovar/publicar automaticamente.

O contrato deve ter versão, esquemas estritos, timeout, assinatura/credencial de serviço, idempotência e respostas com erro sanitizado. As rotas devem operar somente sobre tarefas e dados da organização autenticada.

## 5. Persistência

Migrar o estado operacional durável de arquivos locais para PostgreSQL: tarefas, histórico de execução, calendário, rascunhos, aprovações, referências externas e eventos de auditoria. Usar migrations, backups, índices e políticas de retenção. Arquivos temporários devem ser descartáveis e não servir como fonte de verdade.

## 6. Conteúdo odontológico e revisão humana

- Gerar conteúdo educativo com referências verificáveis e linguagem não enganosa.
- Separar fatos, sugestões de copy e alegações clínicas.
- Rejeitar promessas de resultados garantidos, diagnósticos automatizados destinados ao público e conteúdo não fundamentado.
- Aplicar revisão de conformidade com regras CFO/CRO e política editorial da clínica.
- Conteúdo de pacientes, imagens clínicas e antes/depois exigem avaliação específica de regras, autorização e contexto; não publicar automaticamente.
- Todo rascunho deve permanecer bloqueado até aprovação humana autenticada e registrada.
- Não compartilhar informações clínicas com ECC ou provedores de IA além do estritamente necessário.

## 7. Operação dos agentes

A OdontoMind não deve executar tarefas longas dentro do request HTTP. Validar e persistir a tarefa, responder com ID e deixar o worker processá-la. Implementar estados, retentativas limitadas, timeout, cancelamento, deduplicação, limites de custo e shutdown gracioso.

## 8. Observabilidade e proteção de dados

Registrar ID de correlação, organização, ação, status, duração e erro categorizado. Excluir tokens, conteúdo clínico desnecessário, dados de pacientes e cabeçalhos de autorização. Criar alertas para falhas repetidas, uso de orçamento e erros de conectores.

## 9. Fases de entrega

1. Proteger handlers privilegiados, webhooks e rotas operacionais; criar testes de regressão.
2. Criar migrations e camada de persistência PostgreSQL.
3. Implementar API autenticada de integração com o ECC.
4. Implementar fila/worker e substituir resultados simulados pelos fluxos reais aprovados.
5. Criar ciclo de rascunho, revisão e aprovação.
6. Adicionar conectores oficiais de redes sociais com credenciais de staging.
7. Testar com contas e dados sintéticos; monitorar falhas e métricas.
8. Preparar plano de deploy e rollback; produção somente com aprovação explícita separada.

## 10. Critérios de aceitação

- A rota de push privilegiada está removida ou protegida, sem shell injection e sem push forçado.
- Tokens não têm fallback embutido nem aparecem nos logs.
- Todas as rotas de integração exigem autenticação e autorização.
- Isolamento entre organizações coberto por testes.
- Tarefas e calendário sobrevivem a reinicialização.
- Nenhum conteúdo é publicado sem aprovação humana registrada.
- Testes automatizados e build passam em staging.
- Produção não é modificada por este PR.

## 11. Fora do escopo desta proposta

Este PR adiciona somente o plano de implementação. Não altera handlers, não cria bancos/serviços Render, não publica conteúdo e não altera produção.