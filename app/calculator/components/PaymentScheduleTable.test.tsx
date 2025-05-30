import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentScheduleTable } from './PaymentScheduleTable';
import { PaymentScheduleItem } from '@/app/lib/calculatorUtils';

// Мок для @/app/lib/utils
jest.mock('@/app/lib/utils', () => ({
  formatCurrency: (amount: number, ) => `${amount} ₽`,
}));

describe('PaymentScheduleTable', () => {
  // Создаем массив с 20 платежами для тестирования пагинации
  const mockSchedule: PaymentScheduleItem[] = Array.from({ length: 20 }, (_, index) => ({
    month: index + 1,
    payment: 10000,
    principal: 8000 + index * 100,
    interest: 2000 - index * 100,
    remainingDebt: 92000 - index * 8000,
  }));
  
  it('должен отображать таблицу с правильным количеством строк', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);
    
    // По умолчанию отображается 12 элементов на странице
    const rows = screen.getAllByRole('row');
    // +1 для заголовка таблицы
    expect(rows.length).toBe(12 + 1);
  });
  
  it('должен отображать правильные данные в ячейках таблицы', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);
    
    // Проверяем заголовки таблицы
    expect(screen.getByText('Месяц')).toBeInTheDocument();
    expect(screen.getByText('Ежемесячный платеж')).toBeInTheDocument();
    expect(screen.getByText('Основной долг')).toBeInTheDocument();
    expect(screen.getByText('Проценты')).toBeInTheDocument();
    expect(screen.getByText('Остаток долга')).toBeInTheDocument();
    
    // Проверяем данные первой строки
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10000 ₽')).toBeInTheDocument();
    expect(screen.getByText('8000 ₽')).toBeInTheDocument();
    expect(screen.getByText('2000 ₽')).toBeInTheDocument();
    expect(screen.getByText('92000 ₽')).toBeInTheDocument();
  });
  
  it('должен осуществлять навигацию по страницам', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);
    
    // Проверяем, что отображается информация о страницах
    expect(screen.getByText('Страница 1 из 2')).toBeInTheDocument();
    
    // На первой странице кнопка "Назад" должна быть неактивна
    expect(screen.getByText('Назад')).toBeDisabled();
    expect(screen.getByText('Вперед')).not.toBeDisabled();
    
    // Переходим на вторую страницу
    fireEvent.click(screen.getByText('Вперед'));
    
    // Проверяем, что теперь отображается вторая страница
    expect(screen.getByText('Страница 2 из 2')).toBeInTheDocument();
    
    // На последней странице кнопка "Вперед" должна быть неактивна
    expect(screen.getByText('Назад')).not.toBeDisabled();
    expect(screen.getByText('Вперед')).toBeDisabled();
    
    // Проверяем, что отображаются данные с правильными месяцами (13-20)
    expect(screen.getByText('13')).toBeInTheDocument();
    
    // Возвращаемся на первую страницу
    fireEvent.click(screen.getByText('Назад'));
    
    // Проверяем, что снова отображается первая страница
    expect(screen.getByText('Страница 1 из 2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
  
  it('должен фильтровать платежи по номеру месяца', () => {
    render(<PaymentScheduleTable schedule={mockSchedule} />);
    
    // Вводим номер месяца в поле поиска
    const searchInput = screen.getByPlaceholderText('Поиск по месяцу');
    fireEvent.change(searchInput, { target: { value: '15' } });
    
    // Проверяем, что отображается только один платеж с месяцем 15
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(1 + 1); // +1 для заголовка
    expect(screen.getByText('15')).toBeInTheDocument();
    
    // Очищаем поле поиска
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Проверяем, что снова отображаются все платежи (первая страница)
    expect(screen.getAllByRole('row').length).toBe(12 + 1);
  });
}); 