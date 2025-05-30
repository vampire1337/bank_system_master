import { 
  calculatePaymentSchedule, 
  calculateLoanTotals, 
  formatChartData, 
  formatPieChartData 
} from './calculatorUtils';

describe('Утилиты кредитного калькулятора', () => {
  describe('calculatePaymentSchedule', () => {
    it('должен правильно рассчитывать график платежей', () => {
      const principal = 100000;
      const rate = 10;
      const term = 12;
      
      const schedule = calculatePaymentSchedule(principal, rate, term);
      
      // Проверяем, что возвращается правильное количество платежей
      expect(schedule.length).toBe(term);
      
      // Проверяем, что первый платеж правильно разбит на основной долг и проценты
      expect(schedule[0].month).toBe(1);
      expect(schedule[0].payment).toBeGreaterThan(0);
      expect(schedule[0].principal).toBeGreaterThan(0);
      expect(schedule[0].interest).toBeGreaterThan(0);
      expect(schedule[0].remainingDebt).toBeLessThan(principal);
      
      // Проверяем, что последний платеж имеет нулевой остаток долга
      expect(schedule[term - 1].remainingDebt).toBe(0);
      
      // Проверяем, что сумма всех основных платежей равна сумме кредита
      const totalPrincipal = schedule.reduce((sum, item) => sum + item.principal, 0);
      expect(Math.round(totalPrincipal)).toBe(principal);
    });
  });
  
  describe('calculateLoanTotals', () => {
    it('должен правильно рассчитывать итоговые показатели по кредиту', () => {
      const mockSchedule = [
        { month: 1, payment: 1000, principal: 800, interest: 200, remainingDebt: 9200 },
        { month: 2, payment: 1000, principal: 820, interest: 180, remainingDebt: 8380 },
        { month: 3, payment: 1000, principal: 840, interest: 160, remainingDebt: 7540 }
      ];
      
      const totals = calculateLoanTotals(mockSchedule);
      
      expect(totals.totalPayment).toBe(3000);
      expect(totals.totalPrincipal).toBe(2460);
      expect(totals.totalInterest).toBe(540);
    });
  });
  
  describe('formatChartData', () => {
    it('должен правильно форматировать данные для графика платежей', () => {
      const mockSchedule = [
        { month: 1, payment: 1000, principal: 800, interest: 200, remainingDebt: 9200 },
        { month: 2, payment: 1000, principal: 820, interest: 180, remainingDebt: 8380 },
      ];
      
      const chartData = formatChartData(mockSchedule);
      
      expect(chartData).toEqual([
        { month: 1, Основной_долг: 800, Проценты: 200 },
        { month: 2, Основной_долг: 820, Проценты: 180 },
      ]);
    });
  });
  
  describe('formatPieChartData', () => {
    it('должен правильно форматировать данные для круговой диаграммы', () => {
      const principal = 100000;
      const totalInterest = 20000;
      
      const pieData = formatPieChartData(principal, totalInterest);
      
      expect(pieData).toEqual([
        { name: 'Основной долг', value: principal, fill: '#0066CC' },
        { name: 'Проценты', value: totalInterest, fill: '#FF6B6B' },
      ]);
    });
  });
}); 