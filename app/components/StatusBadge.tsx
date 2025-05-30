import React from "react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  APPROVED: { label: "Одобрено", className: "bg-green-100 text-green-800" },
  REJECTED: { label: "Отклонено", className: "bg-red-100 text-red-800" },
  PENDING: { label: "На рассмотрении", className: "bg-yellow-100 text-yellow-800" },
  ISSUED: { label: "Выдан", className: "bg-blue-100 text-blue-800" },
  CANCELED: { label: "Отменена", className: "bg-gray-100 text-gray-800" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { label, className } = STATUS_MAP[status] || {
    label: "Неизвестно",
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
