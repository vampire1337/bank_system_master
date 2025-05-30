"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { formatCurrency } from "@/app/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  calculatePaymentSchedule, 
  calculateLoanTotals, 
  loanPresets 
} from "@/app/lib/calculatorUtils";

interface LoanComparisonProps {
  currentLoan: {
    amount: number;
    term: number;
    rate: number;
  };
}

interface ComparisonItem {
  id: string;
  name: string;
  amount: number;
  term: number;
  rate: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export const LoanComparison = ({ currentLoan }: LoanComparisonProps) => {
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>(() => {
    // Добавляем текущий кредит по умолчанию
    const currentSchedule = calculatePaymentSchedule(
      currentLoan.amount,
      currentLoan.rate,
      currentLoan.term
    );
    const { totalPayment, totalInterest } = calculateLoanTotals(currentSchedule);
    
    return [{
      id: 'current',
      name: 'Текущий расчет',
      amount: currentLoan.amount,
      term: currentLoan.term,
      rate: currentLoan.rate,
      monthlyPayment: currentSchedule[0].payment,
      totalPayment,
      totalInterest
    }];
  });
  
  const addPresetToComparison = (preset: typeof loanPresets[0]) => {
    const schedule = calculatePaymentSchedule(
      preset.amount,
      preset.rate,
      preset.term
    );
    const { totalPayment, totalInterest } = calculateLoanTotals(schedule);
    
    const newItem: ComparisonItem = {
      id: `preset-${Date.now()}`,
      name: preset.name,
      amount: preset.amount,
      term: preset.term,
      rate: preset.rate,
      monthlyPayment: schedule[0].payment,
      totalPayment,
      totalInterest
    };
    
    setComparisonItems(prev => [...prev, newItem]);
  };
  
  const removeFromComparison = (id: string) => {
    setComparisonItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Данные для графика сравнения
  const chartData = [
    { name: 'Ежемесячный платеж', ...Object.fromEntries(comparisonItems.map(item => [item.name, item.monthlyPayment])) },
    { name: 'Общая сумма', ...Object.fromEntries(comparisonItems.map(item => [item.name, item.totalPayment])) },
    { name: 'Переплата', ...Object.fromEntries(comparisonItems.map(item => [item.name, item.totalInterest])) },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-bold mb-3">Добавить для сравнения</h3>
          <div className="grid grid-cols-2 gap-3">
            {loanPresets.map((preset, index) => (
              <Button 
                key={index}
                variant="outline"
                className="text-left h-auto py-3 flex flex-col items-start"
                onClick={() => addPresetToComparison(preset)}
              >
                <span className="font-bold">{preset.name}</span>
                <span className="text-sm text-gray-600">
                  {formatCurrency(preset.amount)}, {preset.term} мес., {preset.rate}%
                </span>
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-3">Текущие варианты</h3>
          <div className="space-y-2">
            {comparisonItems.map((item, index) => (
              <div 
                key={item.id} 
                className="border rounded p-3 flex justify-between items-center"
                style={{ borderLeftColor: COLORS[index % COLORS.length], borderLeftWidth: 4 }}
              >
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(item.amount)}, {item.term} мес., {item.rate}%
                  </div>
                </div>
                {item.id !== 'current' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFromComparison(item.id)}
                  >
                    Удалить
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {comparisonItems.length > 1 && (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Вариант</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Срок</TableHead>
                  <TableHead>Ставка</TableHead>
                  <TableHead>Ежемесячно</TableHead>
                  <TableHead>Всего</TableHead>
                  <TableHead>Переплата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                    <TableCell>{item.term} мес.</TableCell>
                    <TableCell>{item.rate}%</TableCell>
                    <TableCell>{formatCurrency(item.monthlyPayment)}</TableCell>
                    <TableCell>{formatCurrency(item.totalPayment)}</TableCell>
                    <TableCell>
                      <span className="text-red-600">{formatCurrency(item.totalInterest)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                {comparisonItems.map((item, index) => (
                  <Line 
                    key={item.id}
                    type="monotone" 
                    dataKey={item.name}
                    stroke={COLORS[index % COLORS.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}; 