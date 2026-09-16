# Backlog de Tarefas — Weather App

Este documento deriva do plano técnico em `plans/weather-app-plan.md` e organiza a implementação em tarefas menores, testáveis e ordenadas por dependência.

> Ajuste: a ordem abaixo respeita a sequência de implementação recomendada: tipos → funções puras → services → hook → componentes → integração → testes → hardening.

## Priorização e tamanho relativo

| Tarefa | Prioridade | Tamanho | Observação |
| --- | --- | --- | --- |
| T-01 | P0 | M | Base do projeto e estrutura do app. |
| T-02 | P0 | P | Contratos de domínio bem definidos. |
| T-03 | P0 | P | Validação e normalização puras. |
| T-04 | P0 | M | API de geocoding e mapeamento de cidades. |
| T-05 | P0 | M | Forecast e clima atual do Open-Meteo. |
| T-06 | P0 | M | Normalização de erros e timeouts. |
| T-07 | P0 | M | Estado da aplicação e máquina de estados. |
| T-08 | P0 | M | Busca de cidades e cancelamento de requisições. |
| T-09 | P0 | M | Seleção da cidade e fetch do clima. |
| T-10 | P0 | P | Conversão Celsius/Fahrenheit. |
| T-11 | P0 | P | Mapeamento de clima e datas/timezone. |
| T-12 | P0 | M | Busca e input com UX acessível. |
| T-13 | P0 | M | Lista de resultados de cidade. |
| T-14 | P0 | M | Estados de loading/vazio/erro. |
| T-15 | P0 | M | Clima atual. |
| T-16 | P0 | M | Previsão de 5 dias. |
| T-17 | P0 | M | Integração final do app e toggle de unidade. |
| T-18 | P1 | P | Testes unitários de conversão. |
| T-19 | P1 | P | Testes unitários de validação. |
| T-20 | P1 | P | Testes unitários de códigos e datas. |
| T-21 | P1 | M | Testes do serviço com mock de fetch. |
| T-22 | P1 | M | Testes do hook `useWeather`. |
| T-23 | P1 | M | Testes de componentes em estados de erro/vazio/loading. |
| T-24 | P1 | G | E2E do fluxo principal em desktop e mobile. |
| T-25 | P1 | M | E2E para falhas, retry e empty state. |
| T-26 | P2 | G | Hardening, release e checklist final. |

> P0: entrega mínima funcional do app. P1: qualidade, regressão e cobertura de produto. P2: polish, release e refinamento final.

## Sequência recomendada em fatias verticais

### Fatia 1 — Busca funcional e feedback visual
Objetivo: entregar um app que já responde a pesquisa e mostra resultados/erros de forma clara.

- T-01, T-02, T-03
- T-04, T-06, T-07, T-08
- T-12, T-13, T-14

Resultado visível: o usuário consegue digitar uma cidade, ver sugestões e receber estados de loading, vazio e erro sem quebrar o app.

### Fatia 2 — Clima atual e previsão de 5 dias
Objetivo: transformar a busca em uma experiência útil de previsão meteorológica.

- T-05, T-09, T-10, T-11
- T-15, T-16, T-17

Resultado visível: ao selecionar uma cidade, o app mostra clima atual e previsão de 5 dias com toggle de unidade funcionando.

### Fatia 3 — Qualidade e validação
Objetivo: estabilizar o produto e reduzir regressão antes do release.

- T-18, T-19, T-20, T-21, T-22, T-23
- T-24, T-25

Resultado visível: cobertura automatizada da lógica crítica, UI e fluxo principal, com validação de mobile e cenários de erro.

### Fatia 4 — Release / hardening
Objetivo: fechar os itens de qualidade final antes do deploy.

- T-26

Resultado visível: checklist final de qualidade, lint/build/test verdes, acessibilidade e responsividade confirmadas.

## Recomendação de entrega para produzir algo visível cedo

Se o objetivo for mostrar valor em menos tempo, a melhor ordem é:

1. Fatia 1: busca + estados + lista de cidades
2. Fatia 2: clima atual + previsão + toggle
3. Fatia 3: testes e validação
4. Fatia 4: release

Essa sequência entrega um MVP funcional em poucas iterações e mantém a visão de negócio visible desde o início, em vez de deixar o produto sem feedback até o fim do backlog.

## Entrega 1 — Base e tipos

### T-01 — Configurar a base do projeto e estrutura de pastas
- Descrição curta: preparar a estrutura inicial do app React + Vite + Tailwind e validar scripts de lint/build/test no repositório.
- Critérios de aceite:
  - `pnpm install` conclui com sucesso e os scripts `pnpm lint`, `pnpm build` e `pnpm test` executam sem falha inicial; [verifica suporte de stack e setup do plano].
  - existem os diretórios `src/components`, `src/hooks`, `src/services`, `src/lib`, `src/types` e `src/styles`; [estrutura do projeto].
  - a renderização inicial do app não quebra a compilação e expõe um shell em branco pronto para receber a interface; [base do MVP].
- Dependências: nenhuma.
- Arquivos prováveis: `package.json`, `vite.config.ts`, `tailwind.config.js`, `src/App.tsx`, `src/main.tsx`, `src/styles/globals.css`.
- Tipo: Infra

### T-02 — Definir contratos de domínio do clima
- Descrição curta: criar os tipos compartilhados do domínio meteorológico sem misturar lógica de negócio ou apresentação.
- Critérios de aceite:
  - as interfaces `City`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `WeatherStatus` e `WeatherError` existem e expressam o contrato do Data Model do plano; [FR-02, FR-03, AC-FR02-07].
  - campos opcionais usam `number | null` ou `string | undefined` conforme o contrato e não são representados por zero falso; [NFR-05, regra de ausência sem inventar valores].
  - `tsc --noEmit` compila sem erros após a criação dos tipos; [validação de contrato].
- Dependências: T-01
- Arquivos prováveis: `src/types/weather.ts`.
- Tipo: Data

## Entrega 2 — Funções puras

### T-03 — Definir utilitários de validação e normalização
- Descrição curta: centralizar regras de entrada da busca em funções puras que validam textos e preparametrizam a consulta.
- Critérios de aceite:
  - a função de normalização remove espaços extras, preserva acentos e converte para comparação consistente com o plano; [FR-01, AC-FR01-01].
  - uma string com menos de 2 caracteres não brancos é rejeitada pela validação; [FR-01].
  - a função é pura, sem I/O, sem acessar `fetch` ou DOM, e retorna um resultado determinístico para entrada igual; [testabilidade e separação de camada].
- Dependências: T-02
- Arquivos prováveis: `src/lib/validation.ts`.
- Tipo: Data

### T-10 — Implementar conversão de temperatura e função de apresentação
- Descrição curta: criar a conversão Celsius/Fahrenheit como regra pura e reutilizável pela interface.
- Critérios de aceite:
  - `displayTemperature(21.6, 'celsius')` retorna `22` e `displayTemperature(21.6, 'fahrenheit')` retorna `71`; [FR-04, arredondamento ao inteiro mais próximo].
  - `displayTemperature(null, unit)` retorna `null` e não converte para zero; [NFR-05].
  - a função não persiste o valor convertido em estado e não dispara busca; [State Management].
- Dependências: T-02
- Arquivos prováveis: `src/lib/temperature.ts`.
- Tipo: Data

### T-11 — Implementar mapeamento de clima e formatação de data
- Descrição curta: preparar descrições de condição e datas compatíveis com o timezone local da cidade.
- Critérios de aceite:
  - `weatherCodes.ts` mapeia cada código WMO suportado para texto e ícone e trata código desconhecido como “Indisponível”; [FR-02, FR-03].
  - `date.ts` formata horários usando o timezone da cidade, não o do dispositivo; [AC-FR02-07].
  - a lógica de “mais de 30 minutos” compara `fetchedAt` com o momento atual e marca alerta quando o atraso excede 30 minutos; [AC-FR02-06].
- Dependências: T-02
- Arquivos prováveis: `src/lib/weatherCodes.ts`, `src/lib/date.ts`.
- Tipo: Data

## Entrega 3 — Services da API

### T-04 — Implementar o adaptador de geocoding da Open-Meteo
- Descrição curta: montar a busca de cidades usando o endpoint de geocoding e mapear a resposta para `City[]`.
- Critérios de aceite:
  - `searchCities(query, signal)` chama `https://geocoding-api.open-meteo.com/v1/search` com `name`, `count=5`, `language=pt` e `format=json`; [External APIs + AC-FR01-05].
  - quando a resposta não contém `results`, a função retorna `[]` e não lança erro técnico; [AC-FR01-08].
  - quando a resposta contém até 5 cidades, todas são convertidas para `City`, preservando ordem e campos obrigatórios (`id`, `name`, `country`, `latitude`, `longitude`); [FR-01].
  - o método aceita `AbortSignal` e cancela corretamente a requisição em andamento; [edge case de busca concorrente].
- Dependências: T-02, T-03
- Arquivos prováveis: `src/services/weatherService.ts`.
- Tipo: Data

### T-05 — Implementar o adaptador de forecast da Open-Meteo
- Descrição curta: carregar clima atual e previsão para a cidade selecionada e mapear dados brutos do forecast para o modelo do domínio.
- Critérios de aceite:
  - `getWeather(city, signal)` chama a API com `latitude`, `longitude`, `current`, `daily`, `forecast_days=5` e `timezone=auto`; [FR-02, FR-03, AC-FR02-07, AC-FR03-01].
  - `WeatherData` resultante tem `timezone` vindo da resposta da API e `forecast` com exatamente 5 posições; [FR-03, AC-FR03-01].
  - se `current.temperature_2m`, `current.weather_code` ou `current` estiverem ausentes, o mapeamento preserva os demais campos e usa `null` para os faltantes; [AC-FR02-03].
  - se arrays de `daily` tiverem índices ausentes, os valores vazios viram `null` sem descartar o dia; [AC-FR03-04].
- Dependências: T-02, T-04
- Arquivos prováveis: `src/services/weatherService.ts`.
- Tipo: Data

### T-06 — Normalizar erros de rede, API e timeout no serviço
- Descrição curta: converter falhas de rede, HTTP e timeout em um formato uniforme para o hook.
- Critérios de aceite:
  - `WeatherError.kind` cobre `validation`, `network`, `timeout` e `api`; [Error Handling].
  - `AbortError` é tratado como timeout e não como erro de rede; [NFR-05, timeout de 10s].
  - quando o status HTTP retorna fora de 2xx, o serviço mapea a falha para `kind: 'api'` com mensagem genérica em pt-BR; [Error Handling].
  - o serviço não inventa valores em resposta parcial e não converte `null` em zero; [NFR-05].
- Dependências: T-04, T-05
- Arquivos prováveis: `src/services/weatherService.ts`.
- Tipo: Data

## Entrega 4 — Hook e orquestração

### T-07 — Definir o estado do hook e a máquina de estados
- Descrição curta: criar a estrutura de `WeatherState` e os estados `idle | loading | success | empty | error` em um hook isolado.
- Critérios de aceite:
  - o hook expõe `status`, `query`, `cities`, `selectedCity`, `data`, `error` e `retryCount` exatamente conforme o `WeatherState` do plano; [State Management].
  - o estado inicial é `idle` e não dispara request com query vazia; [FR-01].
  - em `error`, `data` permanece `null` e `error.message` está em pt-BR; [Error Handling].
  - em `empty`, a busca não é tratada como falha técnica e `cities` fica vazio; [AC-FR01-08].
- Dependências: T-02, T-03, T-06
- Arquivos prováveis: `src/hooks/useWeather.ts`.
- Tipo: Data

### T-08 — Implementar a busca de cidades no hook
- Descrição curta: acionar a busca da API quando a query é válida e manter o estado de carregamento e vazio corretos.
- Critérios de aceite:
  - query com menos de 2 caracteres não brancos não chama `searchCities`; [FR-01].
  - query válida dispara `loading` e, em seguida, `success` com `cities` preenchidas ou `empty` quando a resposta vier sem resultados; [FR-01].
  - uma nova busca cancela qualquer requisição anterior em andamento; [edge case do plano].
  - `retryCount` não aumenta para resposta vazia nem para termo inválido; [retry manual e estados].
- Dependências: T-04, T-07
- Arquivos prováveis: `src/hooks/useWeather.ts`.
- Tipo: Data

### T-09 — Implementar a seleção de cidade e fetch do clima no hook
- Descrição curta: trocar a cidade selecionada, limpar dados anteriores e buscar clima/forecast da localidade escolhida.
- Critérios de aceite:
  - ao selecionar uma cidade, `data` anterior é limpo antes de iniciar o novo carregamento; [State Management].
  - `getWeather(city, signal)` é chamada exatamente uma vez para a cidade escolhida; [FR-02, FR-03].
  - quando a resposta vem parcial, o estado ainda entra em `success` e os campos ausentes ficam em `null`; [AC-FR02-03, AC-FR03-04].
  - `retryCount` só permite uma nova tentativa manual por consulta e bloqueia retry após a segunda falha; [Error Handling].
- Dependências: T-05, T-07, T-08
- Arquivos prováveis: `src/hooks/useWeather.ts`.
- Tipo: Data

## Entrega 5 — Componentes da interface

### T-12 — Construir o componente de busca
- Descrição curta: criar a caixa de input e acionadores de busca com validação visual e acessível.
- Critérios de aceite:
  - `SearchBar` expõe um controle com label acessível e `placeholder` que orienta a busca; [a11y + FR-01].
  - ao submeter o formulário com texto inválido, o componente não dispara rede e mantém UI em estado `idle`; [FR-01].
  - ao submeter com termo válido, o callback do hook recebe a string normalizada e pronta para consulta; [FR-01].
- Dependências: T-08
- Arquivos prováveis: `src/components/SearchBar.tsx`.
- Tipo: UI

### T-13 — Construir a lista de resultados de cidade
- Descrição curta: renderizar até 5 cidades com metadados suficientes para a escolha correta.
- Critérios de aceite:
  - a lista renderiza no máximo 5 itens e preserva a ordem recebida pelo geocoding; [AC-FR01-05].
  - cada item exibe `name`, `country` e `admin1` quando houver e é selecionável por clique ou teclado; [FR-01].
  - o componente não renderiza seleção quando `cities` estiver vazio; [empty state].
- Dependências: T-08, T-09
- Arquivos prováveis: `src/components/SearchResults.tsx`.
- Tipo: UI

### T-14 — Implementar estados visuais de loading, vazio e erro
- Descrição curta: criar os componentes de estado para feedback do fluxo principal do app.
- Critérios de aceite:
  - `LoadingState` expõe um `role="status"` ou `aria-live` e não renderiza dados antigos como definitivos; [loading requirement].
  - `EmptyState` comunica claramente “nenhum resultado encontrado” e não é exibido em falha técnica; [AC-FR01-08].
  - `ErrorState` mostra a mensagem em pt-BR e renderiza botão de retry somente quando `canRetry === true`; [Error Handling].
- Dependências: T-08, T-09
- Arquivos prováveis: `src/components/states/LoadingState.tsx`, `src/components/states/EmptyState.tsx`, `src/components/states/ErrorState.tsx`.
- Tipo: UI

### T-15 — Renderizar o clima atual
- Descrição curta: mostrar as condições atuais da cidade selecionada, incluindo campos principais e indisponibilidade.
- Critérios de aceite:
  - `CurrentWeather` exibe temperatura, umidade, vento, precipitação e código meteorológico em ordem consistente com o modelo `CurrentWeather`; [FR-02].
  - quando um campo é `null`, a UI renderiza “Indisponível” sem quebrar o layout; [NFR-05].
  - o componente inclui a linha de fonte “Open-Meteo” e o timestamp de `fetchedAt`; [AC-FR02-06].
- Dependências: T-09, T-10, T-11
- Arquivos prováveis: `src/components/CurrentWeather.tsx`.
- Tipo: UI

### T-16 — Renderizar a previsão de 5 dias
- Descrição curta: exibir a previsão do dia e dos quatro dias seguintes em cards responsivos.
- Critérios de aceite:
  - `ForecastList` renderiza exatamente 5 itens e cada item representa um dia; [FR-03, AC-FR03-01].
  - cada card mostra mínima, máxima, precipitação e condição meteorológica; [FR-03].
  - em layout mobile, a grade usa `grid-cols-2`/`sm:grid-cols-3`/`lg:grid-cols-5` e não quebra horizontalmente; [NFR-02, NFR-03, Tailwind instructions].
- Dependências: T-09, T-10, T-11
- Arquivos prováveis: `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`.
- Tipo: UI

## Entrega 6 — Integração do app

### T-17 — Implementar toggle de unidade e montar o app final
- Descrição curta: integrar a troca de unidade e compor a interface principal sem disparar nova busca.
- Critérios de aceite:
  - o toggle de temperatura alterna entre `°C` e `°F` com valor zero ou mais re-render sem disparar `search`, `selectCity` ou `retry`; [FR-04, State Management].
  - a mesma `WeatherData` em Celsius é usada como origem e a conversão é aplicada apenas em renderização; [FR-04].
  - o layout principal combina `SearchBar`, `SearchResults`, estados e card de clima em uma composição única e responsiva; [NFR-02, NFR-03].
- Dependências: T-12, T-13, T-14, T-15, T-16
- Arquivos prováveis: `src/components/UnitToggle.tsx`, `src/App.tsx`.
- Tipo: UI

## Entrega 7 — Testes

### T-18 — Testar conversão de unidade em isolamento
- Descrição curta: validar a regra de conversão de temperatura em Celsius/Fahrenheit sem depender de interface ou rede.
- Critérios de aceite:
  - um teste cobre `displayTemperature` para valores positivos, negativos e `null`; [FR-04, NFR-05].
  - um teste cobre arredondamento ao inteiro mais próximo em `celsius` e `fahrenheit`; [FR-04].
  - um teste valida que a conversão preserva o dado em Celsius e não gera nova busca ou efeito colateral; [State Management].
- Dependências: T-10
- Arquivos prováveis: `tests/unit/temperature.test.ts`.
- Tipo: Test

### T-19 — Testar validação de entrada em funções puras
- Descrição curta: confirmar a normalização e rejeição de termos de busca sem acionar a rede.
- Critérios de aceite:
  - um teste cobre termo com menos de 2 caracteres não brancos sendo rejeitado; [FR-01].
  - um teste cobre a normalização de texto com espaços extras, caixa e acentos; [FR-01].
  - o teste usa entradas puras e não depende de fetch, DOM ou React; [isolamento de camada].
- Dependências: T-03
- Arquivos prováveis: `tests/unit/validation.test.ts`.
- Tipo: Test

### T-20 — Testar mapeamento de códigos e datas
- Descrição curta: confirmar que o mapeamento WMO e a formatação de datas respeitam o timezone local da cidade.
- Critérios de aceite:
  - todos os códigos suportados têm um mapeamento determinístico para texto e ícone, e código desconhecido não quebra a renderização; [FR-02, FR-03].
  - a data/hora são formatadas no timezone da cidade e não no do navegador; [AC-FR02-07].
  - o teste de 30 minutos cobre intervalo acima de 30 min e abaixo de 30 min; [AC-FR02-06].
- Dependências: T-11
- Arquivos prováveis: `tests/unit/weatherCodes.test.ts`, `tests/unit/date.test.ts`.
- Tipo: Test

### T-21 — Testar o serviço com mock de `fetch`
- Descrição curta: validar geocoding, forecast e erros do serviço sem depender da API real.
- Critérios de aceite:
  - um teste valida que `searchCities` retorna `[]` quando `results` está ausente e até 5 itens quando a resposta tem mais dados; [AC-FR01-05, AC-FR01-08].
  - um teste valida `getWeather` convertendo `current` e `daily` em `WeatherData`, preservando `null` em campos ausentes; [AC-FR02-03, AC-FR03-04].
  - um teste valida HTTP 500, falha de rede e timeout produzindo `kind: 'api'`, `kind: 'network'` e `kind: 'timeout'`; [Error Handling].
  - os testes usam `vi.fn()`/mock de `fetch` e não fazem chamadas reais de rede; [isolamento de camada].
- Dependências: T-04, T-05, T-06
- Arquivos prováveis: `tests/unit/weatherService.test.ts`.
- Tipo: Test

### T-22 — Testar transições do hook `useWeather`
- Descrição curta: validar a máquina de estados e as regras de retry/limpeza de dados do hook.
- Critérios de aceite:
  - um teste verifica que query inválida deixa `status` em `idle`; [FR-01].
  - um teste verifica que `empty` e `error` são mapeados corretamente ao receber resposta sem resultados ou falha de rede; [AC-FR01-08, Error Handling].
  - um teste verifica que a segunda falha desabilita retry manual e mantém o estado `error`; [Error Handling].
  - um teste verifica que `data` anterior é limpo ao iniciar nova busca/seleção; [State Management].
- Dependências: T-07, T-08, T-09
- Arquivos prováveis: `tests/unit/useWeather.test.ts`.
- Tipo: Test

### T-23 — Testar componentes nos estados loading, erro e vazio
- Descrição curta: validar a renderização dos componentes de estado e a acessibilidade do feedback da UI.
- Critérios de aceite:
  - um teste valida `LoadingState` com `role="status"`/`aria-live` e ausência de dados antigos como definitivos; [loading requirement].
  - um teste valida `ErrorState` com mensagem em pt-BR e botão de retry somente quando `canRetry === true`; [Error Handling].
  - um teste valida `EmptyState` com mensagem de ausência de resultados e não confundir com erro técnico; [AC-FR01-08].
- Dependências: T-12, T-13, T-14
- Arquivos prováveis: `tests/unit/stateComponents.test.tsx`, `tests/unit/searchBar.test.tsx`.
- Tipo: Test

### T-24 — Testar E2E do fluxo principal em desktop e mobile
- Descrição curta: validar o caminho feliz, troca de unidade e a experiência real do usuário sem depender da API pública.
- Critérios de aceite:
  - um teste E2E executa: busca válida → seleção de cidade → exibição de clima atual e previsão de 5 dias; [FR-01, FR-02, FR-03].
  - um teste E2E alterna unidade e confirma que o número de requisições permanece zero para o toggle; [FR-04].
  - o mesmo fluxo é executado em viewport mobile (375×667) e desktop, sem scroll horizontal e com navegação por teclado; [NFR-02, NFR-03].
- Dependências: T-17, T-18, T-21, T-22, T-23
- Arquivos prováveis: `tests/e2e/weather-flow.spec.ts`.
- Tipo: Test

### T-25 — Testar E2E de erro, retry e estado vazio
- Descrição curta: validar cenários adversos que exigem mensagens claras e ação de retry.
- Critérios de aceite:
  - ao simular resposta sem resultados, o app mostra estado vazio em vez de erro técnico; [AC-FR01-08].
  - ao simular falha de API ou timeout, a mensagem exibida é pt-BR e o botão de retry só aparece quando `canRetry` é verdadeiro; [Error Handling].
  - após a segunda falha, a ação de retry não aparece e a interface oferece a possibilidade de iniciar nova busca; [Error Handling].
- Dependências: T-17, T-18, T-20, T-21, T-22
- Arquivos prováveis: `tests/e2e/weather-errors.spec.ts`.
- Tipo: Test

## Entrega 8 — Hardening e release

### T-26 — Revisar hardening, observabilidade e checklist final
- Descrição curta: garantir que a solução atende às metas de qualidade e ao release final.
- Critérios de aceite:
  - logs e eventos não expõem query digitada nem coordenadas exatas; [NFR-07, NFR-08].
  - timeout e estados de erro são claros para o usuário, com retry manual limitado e sem retry automático; [Error Handling].
  - `pnpm lint`, `pnpm build` e `pnpm test` passam no ambiente do projeto; [checklist do plano].
  - a aplicação atende a acessibilidade e responsividade previstas em NFR-01 a NFR-09; [metas de qualidade].
- Dependências: T-24, T-25
- Arquivos prováveis: `README.md`, `src/App.tsx`, `src/hooks/useWeather.ts`, `src/services/weatherService.ts`.
- Tipo: Infra

## Matriz de rastreabilidade funcional

| Requisito funcional | Tarefas que implementam o requisito | Cobertura / observação |
| --- | --- | --- |
| FR-01 — Pesquisar localidades | T-03, T-04, T-07, T-08, T-12, T-13, T-19, T-21, T-22, T-23, T-24, T-25 | Cobertura direta em validação, geocoding, hook, UI e testes; inclui busca válida, busca vazia, limite de 5 resultados, desambiguação e nova busca. |
| FR-02 — Exibir clima atual | T-05, T-06, T-09, T-11, T-15, T-17, T-20, T-21, T-24, T-25 | Cobertura direta em serviço, tratamento de dados incompletos, exibição atual, timezone, alertas e testes E2E. |
| FR-03 — Exibir previsão de cinco dias | T-05, T-09, T-11, T-16, T-17, T-20, T-24, T-25 | Cobertura direta em forecast de 5 dias, visualização de 5 posições e indicação de indisponibilidade por dia. |
| FR-04 — Alternar unidade de temperatura | T-10, T-17, T-18, T-24 | Cobertura direta em conversão Celsius/Fahrenheit, exibição sem nova busca e E2E do toggle. |
| FR-05 — Comunicar estados | T-06, T-07, T-08, T-09, T-14, T-17, T-21, T-22, T-23, T-24, T-25, T-26 | Cobertura direta em loading, vazio, erro, retry, timeout e limpeza de dados anteriores. |

### Requisitos sem tarefa correspondente

- Nenhum requisito funcional da spec (`FR-01` a `FR-05`) ficou sem tarefa correspondente no backlog atual.
- O backlog cobre: busca/localização, clima atual, previsão de cinco dias, toggle de unidade e estados/error handling.

## Ordem recomendada de execução

1. T-01, T-02
2. T-03, T-10, T-11
3. T-04, T-05, T-06
4. T-07, T-08, T-09
5. T-12, T-13, T-14, T-15, T-16
6. T-17
7. T-18, T-19, T-20, T-21, T-22, T-23, T-24, T-25
8. T-26

> Essa ordem respeita a cadeia de implementação: tipos → funções puras → services → hook → componentes → integração → testes → hardening.
