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
import { Input } from "@/app/components/ui/input";
import { formatCurrency } from "@/app/lib/utils";
import { PaymentScheduleItem } from "@/app/lib/calculatorUtils";

interface PaymentScheduleTableProps {
  schedule: PaymentScheduleItem[];
}

export const PaymentScheduleTable = ({ schedule }: PaymentScheduleTableProps) => {
  const [page, setPage] = useState(1);
  const [searchMonth, setSearchMonth] = useState("");
  const itemsPerPage = 12;
  
  // Фильтрация по месяцу, если указан поиск
  const filteredSchedule = searchMonth
    ? schedule.filter(item => item.month.toString().includes(searchMonth))
    : schedule;
  
  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const displayedItems = filteredSchedule.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">График платежей</h3>
        <div className="w-48">
          <Input
            placeholder="Поиск по месяцу"
            value={searchMonth}
            onChange={(e) => {
              setSearchMonth(e.target.value);
              setPage(1); // Сбрасываем на первую страницу при поиске
            }}
            className="text-sm"
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Месяц</TableHead>
              <TableHead>Ежемесячный платеж</TableHead>
              <TableHead>Основной долг</TableHead>
              <TableHead>Проценты</TableHead>
              <TableHead>Остаток долга</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedItems.map((item) => (
              <TableRow key={item.month}>
                <TableCell className="font-medium">{item.month}</TableCell>
                <TableCell>{formatCurrency(item.payment)}</TableCell>
                <TableCell>{formatCurrency(item.principal)}</TableCell>
                <TableCell>{formatCurrency(item.interest)}</TableCell>
                <TableCell>{formatCurrency(item.remainingDebt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Страница {page} из {totalPages}
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Назад
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 