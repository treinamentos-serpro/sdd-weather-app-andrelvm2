import { expect, test } from '@playwright/test';

test('exibe estado vazio quando o geocoding não retorna resultados', async ({ page }) => {
  await page.route('**/v1/search**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ results: [] }),
    });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar localidade' }).fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
});

test('não consulta o geocoding para busca vazia ou só com espaços', async ({ page }) => {
  let requestCount = 0;
  await page.route('**/v1/search**', async (route) => {
    requestCount += 1;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ results: [] }) });
  });

  await page.goto('/');
  const searchbox = page.getByRole('searchbox', { name: 'Pesquisar localidade' });
  const searchButton = page.getByRole('button', { name: 'Buscar' });

  await searchButton.click();
  await expect(
    page.getByText('Pesquise uma localidade para consultar a previsão do tempo.'),
  ).toBeVisible();

  await searchbox.fill('   ');
  await searchButton.click();

  expect(requestCount).toBe(0);
});

test('preserva caracteres especiais ao consultar o geocoding', async ({ page }) => {
  let requestedName: string | null = null;
  await page.route('**/v1/search**', async (route) => {
    requestedName = new URL(route.request().url()).searchParams.get('name');
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ results: [] }) });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar localidade' }).fill('São José-dos Campos');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  expect(requestedName).toBe('São José-dos Campos');
});

test('preserva dados válidos e sinaliza forecast incompleto', async ({ page }) => {
  await page.route('**/v1/search**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        results: [{ id: 1, name: 'Recife', country: 'Brasil', latitude: -8.05, longitude: -34.9 }],
      }),
    });
  });

  await page.route('**/v1/forecast**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        current: { temperature_2m: 18, weather_code: 0 },
        daily: {
          time: ['2026-09-16', '2026-09-17'],
          weather_code: [0],
          temperature_2m_max: [29],
        },
      }),
    });
  });

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Pesquisar localidade' }).fill('Recife');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { level: 2, name: 'Recife' })).toBeVisible();
  await expect(page.getByText('18 °C')).toBeVisible();
  await expect(page.getByText('29 °C')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(2);
  await expect(page.getByText('—').first()).toBeVisible();
});

test.describe('fluxo principal em viewport mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('renderiza o clima após buscar uma cidade', async ({ page }) => {
    await page.route('**/v1/search**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              name: 'Recife',
              country: 'Brasil',
              latitude: -8.05,
              longitude: -34.9,
            },
          ],
        }),
      });
    });

    await page.route('**/v1/forecast**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          current: {
            temperature_2m: 28,
            relative_humidity_2m: 76,
            wind_speed_10m: 18,
            precipitation: 0,
            pressure_msl: 1013,
            weather_code: 2,
          },
          daily: {
            time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
            weather_code: [2, 61, 3, 80, 0],
            temperature_2m_max: [29, 30, 29, 28, 30],
            temperature_2m_min: [24, 24, 23, 23, 24],
            precipitation_probability_max: [20, 65, 30, 70, 10],
          },
        }),
      });
    });

    await page.goto('/');
    await page.getByRole('searchbox', { name: 'Pesquisar localidade' }).fill('Recife');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Recife' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Recife' }).getByText('28 °C')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Previsão para os próximos dias' }),
    ).toBeVisible();
  });
});
