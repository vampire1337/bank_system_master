/**
 * Утилиты для кредитного калькулятора
 */

interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingDebt: number;
}

/**
 * Рассчитывает полный график платежей по кредиту
 */
export function calculatePaymentSchedule(
  principal: number,
  annualRate: number,
  termMonths: number
): PaymentScheduleItem[] {
  // Месячная процентная ставка (в десятичном формате)
  const monthlyRate = annualRate / 100 / 12;
  
  // Ежемесячный платеж (аннуитетный)
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  const schedule: PaymentScheduleItem[] = [];
  let remainingDebt = principal;
  
  for (let month = 1; month <= termMonths; month++) {
    // Расчет процентов за текущий месяц
    const interestPayment = remainingDebt * monthlyRate;
    
    // Расчет платежа по основному долгу
    const principalPayment = monthlyPayment - interestPayment;
    
    // Обновление оставшегося долга
    remainingDebt -= principalPayment;
    
    // Добавление информации о платеже в график
    schedule.push({
      month,
      payment: Math.round(monthlyPayment),
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      remainingDebt: Math.max(0, Math.round(remainingDebt)), // Избегаем отрицательных значений из-за округления
    });
  }
  
  return schedule;
}

/**
 * Рассчитывает итоговые показатели по кредиту
 */
export function calculateLoanTotals(schedule: PaymentScheduleItem[]) {
  const totalPayment = schedule.reduce((sum, item) => sum + item.payment, 0);
  const totalPrincipal = schedule.reduce((sum, item) => sum + item.principal, 0);
  const totalInterest = schedule.reduce((sum, item) => sum + item.interest, 0);
  
  return {
    totalPayment,
    totalPrincipal,
    totalInterest,
  };
}

/**
 * Форматирует данные для графика платежей
 */
export function formatChartData(schedule: PaymentScheduleItem[]) {
  return schedule.map((item) => ({
    month: item.month,
    Основной_долг: item.principal,
    Проценты: item.interest,
  }));
}

/**
 * Форматирует данные для графика распределения выплат
 */
export function formatPieChartData(principal: number, totalInterest: number) {
  return [
    { name: 'Основной долг', value: principal, fill: '#0066CC' },
    { name: 'Проценты', value: totalInterest, fill: '#FF6B6B' },
  ];
}

/**
 * Предустановленные варианты кредитов
 */
export const loanPresets = [
  { name: 'Потребительский', amount: 300000, term: 36, rate: 12.9 },
  { name: 'Автокредит', amount: 1200000, term: 60, rate: 9.5 },
  { name: 'Ипотека', amount: 5000000, term: 240, rate: 6.5 },
  { name: 'Быстрый кредит', amount: 100000, term: 12, rate: 15.9 },
];

export type { PaymentScheduleItem }; 