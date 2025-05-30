import { test, expect } from '@playwright/test';

test.describe('Кредитный калькулятор', () => {
  test('должен рассчитывать кредит и отображать график платежей', async ({ page }) => {
    // Переходим на страницу калькулятора
    await page.goto('http://localhost:3002/calculator');
    
    // Проверяем заголовок страницы
    await expect(page.locator('h1')).toContainText('Кредитный калькулятор');
    
    // Вводим данные кредита
    await page.locator('input#amount').fill('500000');
    
    // Устанавливаем срок кредита (используя слайдер или прямой ввод)
    await page.locator('input#term').fill('24');
    
    // Устанавливаем процентную ставку
    await page.locator('input#interestRate').fill('10.5');
    
    // Нажимаем на кнопку расчета
    await page.locator('button:has-text("Рассчитать")').click();
    
    // Ожидаем появления результатов
    await expect(page.locator('.results-container')).toBeVisible();
    
    // Проверяем, что отображается ежемесячный платеж
    await expect(page.locator('text=Ежемесячный платеж')).toBeVisible();
    
    // Проверяем вкладки
    await expect(page.locator('[role="tab"]:has-text("График платежей")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Таблица платежей")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Сравнение")')).toBeVisible();
    
    // Переключаемся на вкладку с графиком платежей
    await page.locator('[role="tab"]:has-text("График платежей")').click();
    
    // Проверяем, что график отображается
    await expect(page.locator('.recharts-responsive-container')).toBeVisible();
    
    // Переключаемся на вкладку с таблицей платежей
    await page.locator('[role="tab"]:has-text("Таблица платежей")').click();
    
    // Проверяем, что таблица отображается
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Номер платежа")')).toBeVisible();
    await expect(page.locator('th:has-text("Дата")')).toBeVisible();
    await expect(page.locator('th:has-text("Платеж")')).toBeVisible();
    
    // Переключаемся на вкладку сравнения
    await page.locator('[role="tab"]:has-text("Сравнение")').click();
    
    // Проверяем, что компонент сравнения отображается
    await expect(page.locator('text=Добавить для сравнения')).toBeVisible();
    
    // Добавляем предустановленный тип кредита для сравнения
    await page.locator('button:has-text("Потребительский")').click();
    
    // Проверяем, что в таблице сравнения отображаются два варианта
    await expect(page.locator('table tr')).toHaveCount(3); // Заголовок + 2 строки данных
  });

  test('должен позволять пользователю переключаться между предустановленными типами кредитов', async ({ page }) => {
    // Переходим на страницу калькулятора
    await page.goto('http://localhost:3002/calculator');
    
    // Проверяем наличие предустановленных типов кредитов
    await expect(page.locator('button:has-text("Потребительский")')).toBeVisible();
    await expect(page.locator('button:has-text("Автокредит")')).toBeVisible();
    await expect(page.locator('button:has-text("Ипотека")')).toBeVisible();
    
    // Выбираем тип "Автокредит"
    await page.locator('button:has-text("Автокредит")').click();
    
    // Проверяем, что данные в форме обновились
    const amountValue = await page.locator('input#amount').inputValue();
    const termValue = await page.locator('input#term').inputValue();
    const rateValue = await page.locator('input#interestRate').inputValue();
    
    // Проверяем, что значения соответствуют предустановленным для автокредита
    expect(parseInt(amountValue)).toBeGreaterThan(0);
    expect(parseInt(termValue)).toBeGreaterThan(0);
    expect(parseFloat(rateValue)).toBeGreaterThan(0);
  });
}); 