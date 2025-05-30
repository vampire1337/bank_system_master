import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentChart } from './PaymentChart';
import { PaymentScheduleItem } from '@/app/lib/calculatorUtils';

// Мок для recharts
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }, ) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children }: { children: React.ReactNode }, ) => (
      <div data-testid="bar-chart">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }, ) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Pie: ({ children }: { children: React.ReactNode }, ) => (
      <div data-testid="pie">{children}</div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Bar: () => <div data-testid="bar" />,
    Cell: () => <div data-testid="cell" />,
    Sector: () => <div data-testid="sector" />,
  };
});

// Мок для @/app/lib/utils
jest.mock('@/app/lib/utils', () => ({
  formatCurrency: (amount: number) => `${amount} ₽`,
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('PaymentChart', () => {
  const mockSchedule: PaymentScheduleItem[] = [
    { month: 1, payment: 10000, principal: 8000, interest: 2000, remainingDebt: 92000 },
    { month: 2, payment: 10000, principal: 8200, interest: 1800, remainingDebt: 83800 },
    { month: 3, payment: 10000, principal: 8400, interest: 1600, remainingDebt: 75400 },
  ];
  
  const mockProps = {
    schedule: mockSchedule,
    principal: 100000,
    totalInterest: 20000,
  };
  
  it('должен отображать график платежей по умолчанию', () => {
    render(<PaymentChart {...mockProps} />);
    
    // Проверяем, что график платежей отображается по умолчанию
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });
  
  it('должен переключаться между графиком платежей и структурой выплат', () => {
    render(<PaymentChart {...mockProps} />);
    
    // Проверяем, что по умолчанию отображается график платежей
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    
    // Нажимаем на кнопку для переключения на структуру выплат
    fireEvent.click(screen.getByText('Структура выплат'));
    
    // Проверяем, что отображается структура выплат
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    
    // Нажимаем на кнопку для переключения обратно на график платежей
    fireEvent.click(screen.getByText('График платежей'));
    
    // Проверяем, что снова отображается график платежей
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });
  
  it('должен отображать итоговую информацию о кредите', () => {
    render(<PaymentChart {...mockProps} />);
    
    // Проверяем отображение суммы кредита
    expect(screen.getByText('Сумма кредита')).toBeInTheDocument();
    expect(screen.getByText('100000 ₽')).toBeInTheDocument();
    
    // Проверяем отображение суммы переплаты
    expect(screen.getByText('Сумма переплаты')).toBeInTheDocument();
    expect(screen.getByText('20000 ₽')).toBeInTheDocument();
  });
}); 
