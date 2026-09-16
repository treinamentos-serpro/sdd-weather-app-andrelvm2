# Especificação de Produto — Weather App

## Overview

Aplicação web responsiva de consulta meteorológica. O usuário pesquisa uma cidade, seleciona a localidade correta, visualiza o clima atual e consulta a previsão de cinco dias. O MVP é mobile-first, em pt-BR, usa Open-Meteo, não exige autenticação e não persiste dados em servidor.

Objetivos:

- Encontrar uma localidade e consultar seu clima em poucos passos.
- Exibir informações atuais e uma previsão comparável de cinco dias.
- Permitir leitura em Celsius ou Fahrenheit sem repetir a consulta.
- Comunicar claramente carregamento, vazio, erro e dados incompletos.

## Functional Requirements

### FR-01 — Pesquisar localidades

Permitir busca por nome de cidade ou localidade, exibindo no máximo cinco resultados ordenados pela relevância retornada pelo geocoding. Cada resultado deve exibir nome, país e, quando disponível, estado ou região para desambiguar localidades homônimas. O sistema deve remover espaços no início e no fim e aceitar diferenças de maiúsculas, minúsculas e acentuação. Novas buscas devem ocorrer sem recarregar a página. O termo deve conter pelo menos dois caracteres não brancos.

### FR-02 — Exibir clima atual

Após a seleção, exibir claramente cidade, contexto local, temperatura atual com unidade e descrição da condição climática. O MVP também deve exibir umidade relativa em percentual, velocidade do vento em km/h e precipitação em mm quando esses dados estiverem disponíveis. Cidade, temperatura e condição são campos obrigatórios; valores ausentes nos campos opcionais devem ser identificados como indisponíveis e nunca apresentados como válidos. Datas e horários devem usar o fuso horário da localidade consultada.

### FR-03 — Exibir previsão de cinco dias

Exibir cinco posições diárias: hoje e os quatro dias seguintes no fuso horário da localidade. Cada posição deve apresentar identificação temporal, temperaturas mínima e máxima e condição climática. Precipitação diária deve ser exibida em mm quando disponível. Se um dia não tiver dados suficientes, a posição deve permanecer visível com indicação explícita de indisponibilidade.

### FR-04 — Alternar unidade de temperatura

Permitir alternância entre Celsius e Fahrenheit. Celsius é a unidade inicial de cada sessão; a unidade ativa deve ser visível e aplicada ao clima atual e a toda a previsão, sem nova consulta à API. A conversão deve usar $F = C \times 9/5 + 32$ e $C = (F - 32) \times 5/9$, com arredondamento para o inteiro mais próximo.

### FR-05 — Comunicar estados

Comunicar os estados inicial, carregamento, sucesso, vazio e erro. Uma consulta deve atingir timeout após 10 segundos; falhas transitórias devem permitir no máximo uma nova tentativa iniciada pelo usuário. Erros da API, falhas de rede e timeout devem gerar mensagem compreensível. Respostas incompletas devem preservar dados válidos e sinalizar lacunas.

## User Stories

- **US-01 — FR-01 / FR-02:** Como Ana, usuária do dia a dia, quero buscar minha cidade e consultar o clima atual para decidir rapidamente o que vestir e planejar meu dia.
- **US-02 — FR-01:** Como Ana, usuária do dia a dia, quero distinguir cidades homônimas pelos resultados de busca para selecionar a localidade correta antes de consultar o clima.
- **US-03 — FR-03:** Como Marina, usuária planejadora, quero visualizar e comparar a previsão de cinco dias para planejar compromissos, atividades e deslocamentos com antecedência.
- **US-04 — FR-04:** Como Marina, usuária planejadora, quero alternar entre Celsius e Fahrenheit para interpretar as temperaturas na unidade que conheço.
- **US-05 — FR-05:** Como Ana, usuária do dia a dia, quero receber mensagens claras durante o carregamento, em estados vazios ou em falhas para saber se devo aguardar, ajustar a busca ou tentar novamente.
- **US-06 — FR-01 / FR-03:** Como Marina, usuária planejadora, quero realizar novas buscas e consultar outra localidade sem recarregar a página para comparar opções de planejamento com agilidade.

## Acceptance Criteria

### FR-01 / US-01 / US-02

- **AC-FR01-01:** **Given** que o campo de busca contém o nome de uma cidade válida, **When** o usuário executar a busca, **Then** o sistema deve exibir pelo menos um resultado relevante.
- **AC-FR01-02:** **Given** que o campo de busca contém espaços nas extremidades, **When** o usuário executar a busca, **Then** o sistema deve ignorar esses espaços ao consultar o termo.
- **AC-FR01-03:** **Given** que o mesmo nome é informado com variação de maiúsculas, minúsculas ou acentuação, **When** o usuário executar a busca, **Then** o sistema deve tratar as variações como o mesmo termo de pesquisa.
- **AC-FR01-04:** **Given** que o campo de busca contém menos de dois caracteres não brancos, **When** o usuário tentar buscar, **Then** o sistema não deve consultar a fonte de dados e deve orientar o preenchimento com pelo menos dois caracteres.
- **AC-FR01-05:** **Given** que a busca retorna localidades, **When** os resultados forem exibidos, **Then** o sistema deve exibir no máximo cinco opções ordenadas pela relevância retornada pelo geocoding.
- **AC-FR01-06:** **Given** que a busca retorna localidades homônimas, **When** os resultados forem exibidos, **Then** cada resultado deve informar o país e, quando disponível, o estado ou a região.
- **AC-FR01-07:** **Given** que o campo de busca está vazio ou contém somente espaços, **When** o usuário tentar buscar, **Then** o sistema não deve consultar a fonte de dados e deve exibir uma orientação de preenchimento.
- **AC-FR01-08:** **Given** que nenhum resultado corresponde ao termo pesquisado, **When** a busca terminar, **Then** o sistema deve exibir um estado vazio informando que nenhuma localidade foi encontrada.
- **AC-FR01-09:** **Given** que uma lista de resultados está disponível, **When** o usuário selecionar uma localidade, **Then** o sistema deve usar essa localidade como contexto da consulta sem recarregar a página.

### FR-02 / US-01

- **AC-FR02-01:** **Given** que uma localidade válida foi selecionada e a resposta contém dados completos, **When** a consulta do clima terminar, **Then** o sistema deve exibir o nome da cidade, seu contexto local, a temperatura atual com unidade e a descrição da condição climática.
- **AC-FR02-02:** **Given** que a resposta contém dados opcionais de umidade, vento ou precipitação, **When** o clima atual for exibido, **Then** esses três indicadores devem ser apresentados, respectivamente, em %, km/h e mm.
- **AC-FR02-03:** **Given** que a resposta não contém cidade, temperatura ou condição, **When** o sistema processar a resposta, **Then** ele deve exibir estado de indisponibilidade e não deve inventar valores.
- **AC-FR02-04:** **Given** que a resposta não contém umidade, vento ou precipitação, **When** o clima atual for exibido, **Then** o campo correspondente deve ser identificado como indisponível sem ocultar os demais dados válidos.
- **AC-FR02-05:** **Given** que o clima atual foi carregado, **When** o usuário visualizar os resultados, **Then** a interface deve exibir “Open-Meteo” como fonte e o horário da última atualização.
- **AC-FR02-06:** **Given** que o horário da última atualização tem mais de 30 minutos, **When** os resultados forem exibidos, **Then** a interface deve informar que os dados podem estar desatualizados.
- **AC-FR02-07:** **Given** que a localidade possui fuso horário próprio, **When** a data ou o horário forem exibidos, **Then** os valores devem corresponder ao fuso horário da localidade e não ao fuso do dispositivo.
- **AC-FR02-08:** **Given** que o clima atual foi carregado, **When** o usuário visualizar a tela de resultados, **Then** a localidade exibida deve corresponder à localidade selecionada.

### FR-03 / US-03

- **AC-FR03-01:** **Given** que uma localidade selecionada possui previsão, **When** a consulta terminar, **Then** o sistema deve exibir exatamente cinco posições: hoje e os quatro dias seguintes.
- **AC-FR03-02:** **Given** que uma posição diária contém dados completos, **When** o usuário consultar seus dados, **Then** ela deve apresentar identificação temporal, temperatura mínima, temperatura máxima e condição climática.
- **AC-FR03-03:** **Given** que uma posição diária contém precipitação, **When** a previsão for exibida, **Then** o valor deve ser apresentado em mm.
- **AC-FR03-04:** **Given** que uma posição diária não contém dados suficientes, **When** a previsão for exibida, **Then** a posição deve permanecer visível com indicação explícita de indisponibilidade e os dados válidos das outras posições devem permanecer visíveis.

### FR-04 / US-04

- **AC-FR04-01:** **Given** que a tela exibe uma temperatura de 0 °C, **When** o usuário selecionar Fahrenheit, **Then** o valor deve ser exibido como 32 °F.
- **AC-FR04-02:** **Given** que a tela exibe uma temperatura de 32 °F, **When** o usuário selecionar Celsius, **Then** o valor deve ser exibido como 0 °C.
- **AC-FR04-03:** **Given** que os dados meteorológicos já foram carregados, **When** o usuário alterar a unidade, **Then** os valores devem ser atualizados sem uma nova consulta à fonte meteorológica.
- **AC-FR04-04:** **Given** que uma unidade foi selecionada, **When** a tela de resultados estiver visível, **Then** nenhuma temperatura exibida deve permanecer identificada com a unidade anterior.

### FR-05 / US-05 / US-06

- **AC-FR05-01:** **Given** que a aplicação foi aberta e nenhuma busca foi realizada, **When** a tela inicial for exibida, **Then** o sistema deve orientar o usuário a pesquisar uma localidade.
- **AC-FR05-02:** **Given** que uma busca ou consulta meteorológica está em andamento, **When** o sistema aguardar a resposta, **Then** deve exibir um indicador de carregamento e não apresentar os novos dados como definitivos.
- **AC-FR05-03:** **Given** que a busca terminou sem resultados, **When** o sistema processar a resposta vazia, **Then** deve exibir estado vazio e não mensagem de erro técnico.
- **AC-FR05-04:** **Given** que a fonte de dados retorna erro, a rede falha ou o tempo limite de 10 segundos é excedido, **When** o sistema detectar a falha, **Then** deve exibir uma mensagem compreensível e uma ação de nova tentativa manual.
- **AC-FR05-05:** **Given** que uma tentativa de consulta falhou, **When** o usuário iniciar nova busca ou selecionar nova tentativa, **Then** a aplicação deve permanecer interativa e não exigir recarregamento da página.
- **AC-FR05-06:** **Given** que o usuário já realizou uma nova tentativa para a mesma consulta e ela falhou, **When** a falha for exibida, **Then** o sistema não deve iniciar novas tentativas automáticas e deve manter a ação de nova busca disponível.
- **AC-FR05-07:** **Given** que uma consulta meteorológica está em andamento para uma nova localidade, **When** o carregamento começar, **Then** o sistema deve limpar os dados meteorológicos anteriores e exibir somente o estado de carregamento até a nova resposta.
- **AC-FR05-08:** **Given** que a resposta contém somente parte dos dados esperados, **When** o sistema renderizar os resultados, **Then** deve preservar os dados válidos e sinalizar as informações ausentes.

## Non-Functional Requirements

- **NFR-01 — Usabilidade:** fluxo curto, linguagem direta em pt-BR e identificação clara da localidade e unidade ativa.
- **NFR-02 — Responsividade:** funcionamento em smartphones, tablets e desktops, sem sobreposição ou rolagem horizontal obrigatória; controles adequados para toque.
- **NFR-03 — Acessibilidade:** atender WCAG 2.2 nível AA; todos os controles devem ter nome acessível, ser operáveis por teclado, possuir foco visível e expor loading, vazio e erro a tecnologias assistivas.
- **NFR-04 — Performance:** o shell inicial deve estar utilizável em até 2 segundos em conexão móvel de referência; cada consulta deve concluir ou apresentar timeout em até 10 segundos; a alternância de unidade deve atualizar a tela em até 100 ms e gerar zero requisições de rede.
- **NFR-05 — Confiabilidade:** respostas vazias, incompletas ou malformadas não devem travar a interface nem gerar dados inventados.
- **NFR-06 — Consistência:** unidade, cidade consultada, fonte Open-Meteo e horário da última atualização devem permanecer claros em toda a visualização; dados exibidos com mais de 30 minutos devem ser identificados como potencialmente desatualizados.
- **NFR-07 — Privacidade e segurança:** não exigir conta, minimizar coleta de dados e não expor detalhes internos em erros.
- **NFR-08 — Operação:** registrar início e resultado das buscas, tipo de falha, latência e timeout sem registrar texto de busca, coordenadas precisas ou dados pessoais desnecessários. Os eventos devem permitir separar falhas de geocoding, forecast e interface.
- **NFR-09 — Manutenibilidade:** separar responsabilidades de dados, transformação e apresentação para permitir testes e troca futura do provedor.

## Traceability Matrix

Os identificadores `AC-FRxx-nn` referem-se aos critérios de aceite da seção
Acceptance Criteria. Os intervalos são inclusivos.

| User Story | Requisitos funcionais | Acceptance Criteria | Requisitos não funcionais relevantes |
| --- | --- | --- | --- |
| US-01 — Ana consulta o clima atual | FR-01, FR-02 | AC-FR01-01 a AC-FR01-09; AC-FR02-01 a AC-FR02-08 | NFR-01, NFR-03, NFR-04, NFR-05, NFR-06 |
| US-02 — Ana desambigua cidades | FR-01 | AC-FR01-01, AC-FR01-03, AC-FR01-05, AC-FR01-06, AC-FR01-08, AC-FR01-09 | NFR-01, NFR-03, NFR-04, NFR-05 |
| US-03 — Marina planeja cinco dias | FR-03 | AC-FR03-01 a AC-FR03-04 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06 |
| US-04 — Marina alterna unidades | FR-04 | AC-FR04-01 a AC-FR04-04 | NFR-03, NFR-04, NFR-06 |
| US-05 — Ana entende estados e falhas | FR-05 | AC-FR05-01 a AC-FR05-08 | NFR-01, NFR-03, NFR-04, NFR-05, NFR-07 |
| US-06 — Marina faz novas consultas | FR-01, FR-03, FR-05 | AC-FR01-05, AC-FR01-09; AC-FR03-01 a AC-FR03-04; AC-FR05-02, AC-FR05-05, AC-FR05-07 | NFR-01, NFR-02, NFR-04, NFR-05, NFR-06 |

## Edge Cases

| Caso | Comportamento esperado |
| --- | --- |
| Busca vazia | Não consultar a fonte e orientar o preenchimento. |
| Acentos ou caracteres especiais | Processar sem quebrar a interface. |
| Cidade homônima | Exibir país e região para desambiguação. |
| Nenhum resultado | Exibir estado vazio claro. |
| Nova busca durante carregamento | Considerar a seleção mais recente e não misturar respostas. |
| Falha de rede, timeout ou API | Exibir erro recuperável e manter a interface interativa. |
| Resposta vazia ou inválida | Exibir indisponibilidade, sem tratar dados inválidos como válidos. |
| Campo ou dia incompleto | Preservar dados válidos e indicar a informação ausente. |
| Menos de cinco dias | Informar que a previsão está incompleta. |
| Campo obrigatório ausente no clima atual | Exibir indisponibilidade, sem inventar temperatura ou condição. |
| Indicador opcional ausente | Mostrar “Indisponível” no campo correspondente. |
| Timeout | Encerrar a consulta após 10 segundos e exibir ação de nova tentativa. |
| Segunda falha consecutiva | Não realizar retry automático adicional e manter nova busca disponível. |
| Dados com mais de 30 minutos | Exibir aviso de informação potencialmente desatualizada. |
| Tela estreita ou orientação alterada | Reorganizar conteúdo sem sobreposição ou rolagem horizontal obrigatória. |

## Assumptions

- A entrega será web, não nativa.
- Open-Meteo será usada para geocoding e forecast sem API key.
- Cinco dias significa hoje mais quatro dias.
- Celsius será a unidade inicial e a conversão ocorrerá na apresentação.
- A interface será pt-BR.
- O clima atual exibirá temperatura, condição, umidade relativa, velocidade do vento e precipitação quando disponíveis.
- Cada dia exibirá mínima, máxima, condição e precipitação quando disponíveis; a previsão sempre terá cinco posições, mesmo quando alguma estiver indisponível.
- A unidade escolhida valerá somente durante a sessão e não será persistida entre acessos.
- O sistema exibirá a fonte Open-Meteo e o horário da última atualização; dados com mais de 30 minutos serão sinalizados.
- A busca aceitará termos com pelo menos dois caracteres não brancos e exibirá no máximo cinco resultados na ordem de relevância do geocoding.
- O timeout será de 10 segundos e haverá no máximo uma nova tentativa manual para a mesma consulta.
- O MVP não terá autenticação, contas, favoritos, histórico persistente ou armazenamento em servidor.
- O suporte inicial será para as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari, incluindo Chrome para Android e Safari para iOS nas versões compatíveis.

## Risks

| Risco | Probabilidade / impacto | Mitigação |
| --- | --- | --- |
| Instabilidade ou limite da Open-Meteo | Alta / alto | Tratar falhas e timeout, permitir nova tentativa e manter observabilidade. |
| Busca ambígua | Média / médio | Exibir contexto geográfico e exigir seleção explícita. |
| Dados incompletos | Média / alto | Validar respostas, sinalizar lacunas e não inventar valores. |
| Experiência mobile insuficiente | Média / alto | Priorizar mobile e testar telas pequenas e toque. |
| Conversão de unidade incorreta | Média / médio | Manter unidade visível e validar os dois sentidos. |
| Latência em redes móveis | Alta / médio | Evitar chamadas redundantes, priorizar dados essenciais e comunicar loading. |
| Falhas de acessibilidade | Média / alto | Validar semântica, foco, contraste, teclado e tecnologia assistiva. |
| Mudança do fornecedor | Baixa / alto | Isolar integração e modelo de dados. |

## Out of Scope

- Autenticação, contas, perfis ou sincronização entre dispositivos.
- Favoritos, histórico persistente e cidades salvas.
- Geolocalização automática por GPS.
- Aplicativos nativos.
- Notificações push e alertas meteorológicos.
- Internacionalização além de pt-BR.
- Previsões além de cinco dias.
- Mapas, radar, satélite, dados históricos e climatologia.
- Integração com calendário, viagens, trânsito ou recomendações de vestuário.
- Backend próprio, banco de dados de produto e funcionamento offline completo.

## Release Criteria

O MVP só deve ser considerado pronto quando:

- todos os critérios de aceite dos FR-01 a FR-05 tiverem testes automatizados passando;
- o fluxo principal funcionar nas duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari, em desktop e mobile;
- a navegação completa por teclado e os estados de loading, vazio e erro forem validados com tecnologia assistiva;
- buscas válidas, buscas sem resultado, falha de API, timeout, resposta parcial e alternância de unidade forem cobertos por testes;
- a aplicação atingir a meta de shell inicial em até 2 segundos no ambiente de referência e não emitir erros não tratados durante o fluxo principal;
- não houver exposição de credenciais, dados pessoais desnecessários ou detalhes internos nas mensagens exibidas ao usuário.

## Open Questions

Nenhuma questão bloqueante permanece para o MVP. A aplicação começa sem localidade selecionada; uma localidade sem cobertura suficiente exibe estado de indisponibilidade e mantém a busca disponível.
