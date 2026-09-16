# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou o desenvolvimento de uma aplicação web de previsão do tempo com foco em usabilidade, mobilidade e acesso rápido à informação climática. A solução deve permitir que usuários consultem condições meteorológicas de cidades, visualizem o clima atual e a previsão de 5 dias, alternem entre unidades de temperatura em Celsius e Fahrenheit e tenham uma experiência funcional em dispositivos móveis.

O produto deve ser simples de usar, com navegação intuitiva, carregamento rápido e apresentação clara das informações. Como a aplicação depende de dados meteorológicos em tempo real, também é importante tratar corretamente cenários de falha de rede, buscas sem resultado e inconsistências na API de origem.

A aplicação tem caráter de utilidade pública e de consulta rápida, sendo especialmente relevante para uso em smartphones, onde a conveniência e a acessibilidade são prioritárias.

## Requisitos Funcionais

1. Busca de cidades
   - O usuário deve conseguir pesquisar por nome de cidade ou localidade.
   - A aplicação deve apresentar resultados relevantes para a busca.
   - A busca deve funcionar em ambiente web e em dispositivos móveis.

2. Visualização do clima atual
   - A aplicação deve exibir ao menos os principais indicadores do clima atual da cidade selecionada.
   - Deve incluir, no mínimo, temperatura e descrição do clima.
   - A interface deve mostrar claramente o contexto local da cidade consultada.

3. Previsão de 5 dias
   - A aplicação deve apresentar uma previsão de 5 dias para a cidade selecionada.
   - Cada dia deve ter informações legíveis e organizadas.
   - Os dados devem ser apresentados de modo facilmente comparável entre dias.

4. Alternância entre Celsius e Fahrenheit
   - O usuário deve poder alternar entre unidades de temperatura em Celsius e Fahrenheit.
   - A conversão deve ocorrer na apresentação, sem exigir nova busca por parte do usuário.
   - A escolha da unidade deve ser visível e consistente em toda a interface.

5. Tratamento de estados da aplicação
   - A aplicação deve informar estados de carregamento enquanto busca os dados.
   - Deve exibir mensagens adequadas para erros de consulta ou falhas de rede.
   - Deve apresentar estado vazio quando não houver resultados ou quando o usuário ainda não realizou uma busca.

## Requisitos Não-Funcionais

1. Usabilidade
   - A interface deve ser intuitiva e simples, com poucos passos para obter a informação desejada.
   - A experiência deve ser consistente entre desktop e mobile.

2. Responsividade
   - A aplicação deve adaptar-se a diferentes tamanhos de tela, com foco em smartphones.
   - Elementos interativos devem manter boa usabilidade em dispositivos touch.

3. Performance
   - O carregamento inicial e as consultas de clima devem ocorrer em tempo adequado.
   - A interface deve responder rapidamente às interações do usuário.

4. Acessibilidade
   - O uso da aplicação deve considerar contraste, labels, foco e navegação por teclado.
   - Ícones e textos devem ser compreensíveis em diferentes contextos.

5. Disponibilidade
   - A aplicação deve continuar acessível mesmo quando a API externa apresentar instabilidade temporária.
   - Em caso de falha, a interface deve informar o problema de forma clara sem quebrar o fluxo.

6. Confiabilidade
   - A aplicação deve lidar corretamente com falhas de rede, resposta vazia ou erro da API externa.
   - A experiência não deve quebrar em caso de dados incompletos.

7. Manutenibilidade
   - A solução deve seguir arquitetura clara e separação de responsabilidades.
   - Código deve ser organizado para facilitar evolução e testes.

8. Segurança e privacidade
   - Como o produto não exige autenticação, deve-se evitar coleta excessiva de dados do usuário.
   - A integração com APIs externas deve seguir práticas básicas de segurança e limites de uso.

9. Observabilidade
   - O sistema deve registrar falhas, latência e erros para facilitar diagnósticos e suporte.
   - A equipe deve ter visibilidade suficiente para identificar problemas em produção.

10. Consistência de dados e frescor
   - A aplicação deve apresentar claramente a fonte e a janela temporal dos dados exibidos.
   - A interface deve indicar se a informação está atualizada ou pode ter atraso.

11. Compatibilidade de navegadores e dispositivos
   - A aplicação deve funcionar em navegadores modernos e em tamanhos de tela comuns do mercado.
   - O comportamento deve ser previsível em diferentes combinações de navegador e dispositivo.

## Riscos

1. Dependência de API externa
   - A qualidade do serviço depende diretamente da disponibilidade e confiabilidade da API de previsão do tempo.
   - Falhas, timeouts ou respostas incompletas podem impactar o uso da aplicação.

2. Ambiguidade na busca por cidades
   - Nomes de cidades com múltiplas localidades, variantes regionais ou textos incompletos podem gerar resultados inconsistentes.

3. Experiência mobile insuficiente
   - Se a interface não for priorizada para mobile, o produto pode perder eficácia em um canal crítico de uso.

4. Conversão de unidades sem contexto
   - Usuários podem interpretar a mudança entre °C e °F de forma confusa se a interface não deixar clara a unidade ativa.

5. Dados insuficientes para previsão de 5 dias
   - A API pode não disponibilizar dados completos ou consistentes para todas as localidades, especialmente em regiões menos cobertas.

6. Requisitos pouco detalhados
   - O briefing menciona funcionalidade principal, mas não define critérios detalhados de UX, exibição dos dados, idioma, localização padrão ou comportamento em caso de ausência de resultados.

### Mapeamento de riscos técnicos e de produto

| Risco | Probabilidade | Impacto | Estratégia de mitigação |
| --- | --- | --- | --- |
| Dependência de API externa instável | Alta | Alto | Implementar fallback visual para erro, tratar timeouts com retry limitado, cache de respostas recentes e alertas claros quando a API estiver indisponível. |
| Busca por cidade ambígua ou incompleta | Média | Médio | Validar resultados da API, exibir opções de localização quando houver múltiplos resultados e definir regras para buscas parciais e cidades com nomes repetidos. |
| Falta de usabilidade em mobile | Média | Alto | Priorizar design mobile-first, testar em telas pequenas e validar o fluxo com usuários reais para garantir legibilidade, toque e navegação simples. |
| Conversão Celsius/Fahrenheit sem clareza | Média | Médio | Manter a unidade sempre visível na interface, usar rótulos explícitos e garantir que a mudança de escala seja intuitiva. |
| Dados incompletos ou inconsistentes da API | Média | Alto | Validar payloads antes de renderizar, tratar valores ausentes com fallback e exibir mensagens de contexto quando a previsão for incompleta. |
| Latência alta em redes lentas | Alta | Médio | Minimizar payloads, usar cache, reduzir chamadas redundantes e priorizar dados essenciais na primeira renderização. |
| Falta de acessibilidade | Média | Alto | Seguir boas práticas de acessibilidade, como contraste, foco, labels, semântica e navegação por teclado, além de testes com tecnologias assistivas. |
| Requisitos pouco definidos do MVP | Alta | Alto | Concluir o escopo mínimo antes da implementação, documentar critérios de aceite e separar funcionalidades obrigatórias das desejáveis. |
| Excesso de escopo em relação ao briefing | Média | Alto | Definir um MVP claro, priorizar por valor de usuário e evitar adicionar recursos sem validação. |
| Erro na apresentação de previsões em dias sem dados | Média | Médio | Tratar dados ausentes com estado apropriado e validar regras para localidades com cobertura limitada. |
| Problemas de compatibilidade em navegadores e dispositivos | Média | Médio | Testar em navegadores modernos e em tamanhos de tela comuns e evitar uso de recursos dependentes de browser específico. |
| Falhas operacionais sem observabilidade | Média | Alto | Instrumentar logs, métricas e monitoramento de erros para identificar falhas de API e problemas em produção. |
| Segurança e privacidade insuficientes | Baixa | Médio | Evitar coleta desnecessária de dados, revisar integrações externas e aplicar limites e tratamento seguro de erros. |
| Mudança de fornecedor ou contrato da API | Baixa | Alto | Isolar a camada de serviços e abstrair o contrato da API para facilitar a troca de provedor. |
| Produto com baixa retenção do usuário | Média | Médio | Melhorar recorrência com histórico, última cidade consultada, preferência persistente e experiência rápida e simples. |

## Personas

### Persona 1: Ana, 29 anos — Usuária do dia a dia
- Objetivo principal: consultar rapidamente o clima para decidir o que vestir e planejar o dia sem perder tempo.
- Contexto de uso: uso principal em mobile, em deslocamento e com interações frequentes e curtas. Busca informação imediata e confiável antes de sair de casa ou no caminho até o trabalho.
- Métrica de sucesso: encontrar a informação em menos de 10 segundos, usar o app diariamente e sentir que a interface é clara e confiável para decisões rápidas.

### Persona 2: Marina, 35 anos — Usuária planejadora
- Objetivo principal: avaliar a previsão de 5 dias para planejar compromissos, atividades e deslocamentos com antecedência.
- Contexto de uso: utiliza o app em desktop e mobile, com foco em decisões mais deliberadas e leitura comparativa entre diferentes dias. Valorizando clareza dos dados e facilidade de análise.
- Métrica de sucesso: compreender a previsão de 5 dias em poucos segundos, confiar na comparação entre dias e usar o app como ferramenta de planejamento pessoal.

## Perguntas em Aberto

1. A aplicação deve ser web apenas ou também há necessidade de suporte nativo mobile?
2. Qual é o público-alvo principal: usuários gerais, viajantes, pessoas em áreas específicas ou outro perfil?
3. Há alguma exigência de localização automática com base no GPS do usuário?
4. A cidade deve ser pesquisada em qual idioma e com quais tipos de resultado (país, estado, município, bairro)?
5. Quais indicadores climáticos devem ser exibidos além de temperatura e condição do tempo?
6. É necessário exibir dados de vento, umidade, precipitação, sensação térmica ou índices UV?
7. A previsão de 5 dias deve incluir apenas temperatura ou também descrição do clima para cada dia?
8. A aplicação deve permitir múltiplas buscas em sequência sem recarregar a página?
9. Há preferência por design dark mode, glassmorphism ou outro estilo visual específico?
10. Existem requisitos de compatibilidade com navegadores e versões de dispositivos específicos?

## Decisões

1. Fonte de dados: Open-Meteo (sem API key)
   - Justificativa: a API oferece geocoding e forecast com acesso direto, sem necessidade de autenticação do usuário e sem custo inicial para o projeto.
   - Resolve: elimina a incerteza sobre provedor de dados e reduz a complexidade de integração e autenticação.

2. "5 dias" = hoje + 4 dias
   - Justificativa: define claramente a janela de previsão para evitar interpretações inconsistentes da regra de negócio e manter a experiência coerente com a API.
   - Resolve: responde à ambiguidade sobre o que exatamente significa a previsão de 5 dias e a estrutura temporal da informação.

3. Unidade padrão: Celsius
   - Justificativa: a temperatura em Celsius é a convenção mais comum para uso geral e para a experiência local do usuário no contexto do produto.
   - Resolve: define a unidade inicial da interface e reduz ambiguidade sobre a configuração padrão e a conversão visual.

4. Sem autenticação e sem persistência de servidor
   - Justificativa: o produto é um MVP de consulta meteorológica simples, com foco em usabilidade e agilidade, sem necessidade de contas ou armazenamento centralizado de dados.
   - Resolve: elimina a necessidade de gestão de usuários, sessão, banco de dados e backend próprio, simplificando a arquitetura e reduzindo riscos de manutenção.

5. Idioma da UI: pt-BR
   - Justificativa: o projeto e o público-alvo são definidos no contexto em português do Brasil, e isso melhora a coerência cultural e a clareza da interface.
   - Resolve: fecha a questão sobre idioma da interface e reduz dúvidas sobre textos, labels e microcopy.

## Suposições

1. A aplicação será desenvolvida como uma solução web responsiva, priorizando dispositivos móveis.
2. A API Open-Meteo será usada como fornecedor de dados, sem necessidade de autenticação do usuário.
3. A busca por cidade será baseada em geocoding e retornará localidades relevantes para a consulta.
4. O clima atual e a previsão de 5 dias serão exibidos em um único fluxo de uso, após a seleção da cidade.
5. A conversão entre Celsius e Fahrenheit será feita apenas na apresentação visual, sem alterar a fonte de dados.
6. A interface deve tratar de forma explícita os estados de carregamento, erro e vazio.
7. O foco inicial do produto é funcionalidade e usabilidade, não personalização avançada de usuário.
8. O projeto será entregue como um MVP com bons padrões de qualidade, testabilidade e arquitetura simples.
