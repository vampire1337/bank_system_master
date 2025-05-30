import { test, expect } from '@playwright/test';

test.describe('Кредитный калькулятор', () => {
  test('должен правильно рассчитывать платежи и отображать результаты', async ({ page }) => {
    // Переходим на страницу калькулятора
    await page.goto('/calculator');
    
    // Проверяем, что калькулятор загружен
    await expect(page.getByText('Сумма кредита')).toBeVisible();
    
    // Устанавливаем сумму кредита
    await page.fill('input#amount', '300000');
    
    // Устанавливаем срок кредита
    const termSlider = page.locator('input[type="range"]').first();
    await termSlider.evaluate((input) => {
      const sliderInput = input as HTMLInputElement;
      sliderInput.value = '24';
      sliderInput.dispatchEvent(new Event('input', { bubbles: true }));
      sliderInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Устанавливаем процентную ставку
    await page.fill('input#interestRate', '12');
    
    // Проверяем, что результаты расчета отображаются
    await expect(page.getByText('Ежемесячный платеж')).toBeVisible();
    
    // Нажимаем на кнопку "Показать подробный расчет"
    await page.click('button:has-text("Показать подробный расчет")');
    
    // Проверяем, что табы с детальной информацией отображаются
    await expect(page.getByRole('tab', { name: 'График платежей' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Таблица платежей' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Сравнение' })).toBeVisible();
    
    // Проверяем, что график платежей отображается
    await expect(page.locator('[data-testid="bar-chart"]')).toBeVisible();
    
    // Переключаемся на вкладку "Таблица платежей"
    await page.click('button:has-text("Таблица платежей")');
    
    // Проверяем, что таблица отображается
    await expect(page.getByText('Ежемесячный платеж')).toBeVisible();
    await expect(page.getByText('Основной долг')).toBeVisible();
    await expect(page.getByText('Проценты')).toBeVisible();
    
    // Переключаемся на вкладку "Сравнение"
    await page.click('button:has-text("Сравнение")');
    
    // Добавляем вариант для сравнения
    await page.click('button:has-text("Потребительский")');
    
    // Проверяем, что сравнительная таблица отображается
    await expect(page.getByText('Текущий расчет')).toBeVisible();
    await expect(page.getByText('Потребительский')).toBeVisible();
    
    // Скрываем детальный расчет
    await page.click('button:has-text("Скрыть детали")');
    
    // Проверяем, что детальный расчет скрыт
    await expect(page.getByRole('tab', { name: 'График платежей' })).not.toBeVisible();
  });
  
  test('неавторизованный пользователь должен видеть кнопку "Войти для сохранения"', async ({ page }) => {
    // Переходим на страницу калькулятора
    await page.goto('/calculator');
    
    // Проверяем, что отображается кнопка "Войти для сохранения"
    await expect(page.getByText('Войти для сохранения')).toBeVisible();
    
    // Нажимаем на кнопку "Войти для сохранения"
    await page.click('text=Войти для сохранения');
    
    // Проверяем, что перенаправлены на страницу входа
    await expect(page).toHaveURL(/\/auth\/login/);
  });
  
  test.describe('Авторизованный пользователь', () => {
    test.beforeEach(async ({ page }) => {
      // Эмулируем авторизацию
      await page.evaluate(() => {
        window.localStorage.setItem('next-auth.session-token', 'fake-token');
      });
    });
    
    test('авторизованный пользователь должен иметь возможность сохранить расчет', async ({ page }) => {
      // Переходим на страницу калькулятора
      await page.goto('/calculator');
      
      // Проверяем, что отображается кнопка "Сохранить расчет"
      await expect(page.getByText('Сохранить расчет')).toBeVisible();
      
      // Нажимаем на кнопку "Сохранить расчет"
      await page.click('text=Сохранить расчет');
      
      // Проверяем, что появляется сообщение об успешном сохранении
      await expect(page.getByText('Сохранено!')).toBeVisible({ timeout: 5000 });
    });
  });
}); 