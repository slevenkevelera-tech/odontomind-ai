export interface DentalService {
  id: string;
  name: string;
  category: string;
  ticketRange: string;
  margin: string;
  chairTime: string;
  ltvImpact: string;
  techRequired: string[];
  description: string;
  clinicalProtocol: string;
  viralMarketingAngle: string;
  croRuleNotice: string;
}

export const essentialServices: DentalService[] = [
  {
    id: 'alinhadores-invisiveis',
    name: 'Ortodontia Digital & Alinhadores Invisíveis',
    category: 'Ortodontia de Alta Precisão',
    ticketRange: 'R$ 6.500 - R$ 18.000',
    margin: '62%',
    chairTime: '20-30 min por consulta',
    ltvImpact: 'Altíssimo (12 a 24 meses de retenção ativa)',
    techRequired: ['Scanner Intraoral 3D (iTero/Trios)', 'Software de Simulação de Sorriso', 'Impressão 3D de Modelos'],
    description: 'Tratamento de maior demanda espontânea do mercado moderno. Substitui fios e braquetes metálicos por placas transparentes personalizadas e removíveis.',
    clinicalProtocol: 'Escaneamento digital na 1ª sessão -> Planejamento virtual com setup tridimensional -> Apresentação do vídeo de evolução ao paciente -> Entrega dos pares de alinhadores com checagem de attachments.',
    viralMarketingAngle: 'Comparação de dia a dia: poder comer sem comida presa no aparelho, praticar esportes e trabalhar sem ninguém notar o tratamento.',
    croRuleNotice: 'Proibido anunciar marcas comerciais com caráter exclusivista que induza o paciente a erro; focar na técnica de alinhadores transparentes sob supervisão direta do especialista.'
  },
  {
    id: 'implantes-carga-imediata',
    name: 'Implantodontia Guiada & Carga Imediata',
    category: 'Reabilitação Oral Cirúrgica',
    ticketRange: 'R$ 4.000 - R$ 28.000 (unitário a protocolo completo)',
    margin: '68%',
    chairTime: '45-90 min',
    ltvImpact: 'Excepcional (impacto emocional de transformação de vida)',
    techRequired: ['Tomografia Computadorizada Cone Beam', 'Guia Cirúrgico Impresso em 3D', 'Motor Cirúrgico com Controle de Torque'],
    description: 'Devolução da função mastigatória e autoestima sem necessidade de cortes extensos ou pontos dolorosos através da cirurgia guiada por computador.',
    clinicalProtocol: 'Tomografia + Escaneamento intraoral sobrepostos em software -> Cirurgia guiada flapless (sem incisão com bisturi) -> Instalação de dente provisório imediato no mesmo dia quando há estabilidade primária.',
    viralMarketingAngle: 'Histórias reais de superação: o alívio de voltar a mastigar uma maçã ou sorrir em fotos de família sem medo de prótese móvel cair.',
    croRuleNotice: 'Nunca exibir imagens de campo cirúrgico com sangue ou órgãos expostos. Imagens de antes e depois exigem TCLE e não podem prometer cicatrização idêntica para todos.'
  },
  {
    id: 'lentes-resina-ceramica',
    name: 'Lentes de Contato Cerâmicas & Facetas em Resina',
    category: 'Dentística & Estética Avançada',
    ticketRange: 'R$ 1.800 - R$ 3.500 por dente',
    margin: '70%',
    chairTime: '60-120 min',
    ltvImpact: 'Alto (indicações constantes de amigos e familiares)',
    techRequired: ['DSD (Digital Smile Design)', 'Fresadora CAD/CAM de Consultório', 'Fotografia Odontológica Macro'],
    description: 'Correção de formato, proporção, cor e pequenos desalinhamentos dentários com lâminas ultrafinas de dissilicato de lítio ou resina estratificada.',
    clinicalProtocol: 'Análise facial e proporção áurea -> Mock-up em boca para o paciente aprovar o sorriso antes de qualquer desgaste -> Preparo minimamente invasivo -> Cimentação adesiva definitiva.',
    viralMarketingAngle: 'O efeito "Mock-up": gravação do paciente vendo seu novo sorriso temporário pela primeira vez no espelho da clínica.',
    croRuleNotice: 'É vedado garantir que os dentes ficarão permanentemente brancos sem manutenção ou criar expectativas de dentes extremamente artificiais.'
  },
  {
    id: 'checkup-digital-profilaxia',
    name: 'Check-up Preventivo Digital & Profilaxia Ultrassônica',
    category: 'Saúde Bucal & Manutenção Contínua',
    ticketRange: 'R$ 350 - R$ 750 por sessão',
    margin: '78%',
    chairTime: '45 min',
    ltvImpact: 'Base do Faturamento Recorrente (visitas a cada 6 meses)',
    techRequired: ['Câmera Intraoral HD', 'Ultrassom Piezoelétrico com Jato de Glicina', 'Sonda Periodontal Computadorizada'],
    description: 'A espinha dorsal da clínica preventiva. Mostra na tela para o paciente problemas em estágio inicial antes que causem dor ou exijam tratamentos invasivos.',
    clinicalProtocol: 'Fotografia com câmera intraoral em 40x de aumento -> Revelação de biofilme dental -> Raspagem suave com glicina aquecida -> Polimento coronário -> Envio de relatório PDF para o WhatsApp do paciente.',
    viralMarketingAngle: 'Câmera intraoral em close-up revelando a diferença antes e depois da limpeza profissional (conteúdo altamente satisfatório e viciante nas redes).',
    croRuleNotice: 'Não usar termos apelativos como "limpeza milagrosa" ou realizar consultas gratuitas com finalidade de captação de clientes para outros procedimentos.'
  },
  {
    id: 'harmonizacao-orofacial-etica',
    name: 'Harmonização Orofacial Ética (HOF)',
    category: 'Estética Funcional',
    ticketRange: 'R$ 1.500 - R$ 8.000 por procedimento',
    margin: '60%',
    chairTime: '30-60 min',
    ltvImpact: 'Médio a Alto (manutenções periódicas a cada 6-12 meses)',
    techRequired: ['Guia de Anatomia Ultrassonográfica', 'Materiais Injetáveis Registrados na ANVISA', 'Fotografia Padronizada com Luz Estúdio'],
    description: 'Equilíbrio funcional e estético entre dentes, lábios e face, tratando assimetrias, sorriso gengival e perda de sustentação tecidual.',
    clinicalProtocol: 'Análise morfológica facial -> Termo de consentimento específico -> Aplicação com agulhas atraumáticas ou microcânulas -> Retorno de avaliação após 15 dias.',
    viralMarketingAngle: 'Tratamento de sorriso gengival e melhora do suporte do lábio superior que potencializa a beleza dos dentes naturais.',
    croRuleNotice: 'A HOF é reconhecida pelo CFO como especialidade odontológica dentro da área de atuação anatômica da cabeça e pescoço. Proibido anunciar procedimentos médicos corporais.'
  },
  {
    id: 'endodontia-microscopica',
    name: 'Endodontia Microscópica (Tratamento de Canal em 1 Sessão)',
    category: 'Urgência & Salvamento Dental',
    ticketRange: 'R$ 1.200 - R$ 2.800',
    margin: '65%',
    chairTime: '60-75 min',
    ltvImpact: 'Fidelização por alívio da dor aguda',
    techRequired: ['Microscópio Operatório Odontológico', 'Localizador Apical Eletrônico', 'Sistemas Rotatórios Reciprocantes de NiTi'],
    description: 'Eliminação da dor e infecção mantendo o dente natural, executado com auxílio de microscópio para visualização de canais com aumento de até 25x.',
    clinicalProtocol: 'Anestesia computadorizada indolor -> Isolamento absoluto -> Instrumentação mecanizada -> Desinfecção com ativação ultrassônica -> Obturação tridimensional imediata.',
    viralMarketingAngle: 'Quebra de tabu total: "Canal dói? Veja como a anestesia computadorizada e a microscopia transformaram o tratamento de canal em uma soneca na cadeira".',
    croRuleNotice: 'Proibido prometer sucesso absoluto em infecções pré-existentes; apresentar como procedimento especializado de preservação de elementos biológicos.'
  }
];
