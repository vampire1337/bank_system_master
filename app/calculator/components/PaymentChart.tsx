"use client";

import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector
} from "recharts";
import { Button } from "@/app/components/ui/button";
import { formatCurrency } from "@/app/lib/utils";
import { PaymentScheduleItem, formatChartData, formatPieChartData } from "@/app/lib/calculatorUtils";

interface PaymentChartProps {
  schedule: PaymentScheduleItem[];
  principal: number;
  totalInterest: number;
}

export const PaymentChart = ({ schedule, principal, totalInterest }: PaymentChartProps) => {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [activeIndex, setActiveIndex] = useState(0);
  
  const barChartData = formatChartData(schedule);
  const pieChartData = formatPieChartData(principal, totalInterest);
  
  // Для графика показываем только каждый 6-й месяц, если срок > 36 месяцев
  const displayedData = schedule.length > 36 
    ? barChartData.filter((_, index) => index % 6 === 0 || index === barChartData.length - 1)
    : barChartData;
  
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-sm">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-lg font-bold">
          {formatCurrency(value)}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#333" className="text-xs">
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{`Месяц ${label}`}</p>
          <p className="text-blue-600">{`Основной долг: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-red-500">{`Проценты: ${formatCurrency(payload[1].value)}`}</p>
          <p className="font-bold">{`Всего: ${formatCurrency(payload[0].value + payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2 mb-4">
        <Button 
          variant={chartType === "bar" ? "default" : "outline"} 
          onClick={() => setChartType("bar")}
          size="sm"
        >
          График платежей
        </Button>
        <Button 
          variant={chartType === "pie" ? "default" : "outline"} 
          onClick={() => setChartType("pie")}
          size="sm"
        >
          Структура выплат
        </Button>
      </div>
      
      {chartType === "bar" ? (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                label={{ 
                  value: 'Месяц', 
                  position: 'insideBottomRight', 
                  offset: -5 
                }} 
              />
              <YAxis 
                tickFormatter={(value) => `${Math.round(value / 1000)}т.р.`}
                label={{ 
                  value: 'Рубли', 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              <Tooltip content={customTooltip} />
              <Legend />
              <Bar dataKey="Основной_долг" stackId="a" fill="#0066CC" name="Основной долг" />
              <Bar dataKey="Проценты" stackId="a" fill="#FF6B6B" name="Проценты" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-gray-600 text-sm">Сумма кредита</p>
          <p className="font-bold text-lg">{formatCurrency(principal)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Сумма переплаты</p>
          <p className="font-bold text-lg text-red-600">{formatCurrency(totalInterest)}</p>
        </div>
      </div>
    </div>
  );
}; 