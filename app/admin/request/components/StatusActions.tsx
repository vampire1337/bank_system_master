"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

interface StatusActionsProps {
  requestId: string;
  currentStatus: string;
}

export const StatusActions: React.FC<StatusActionsProps> = ({
  requestId,
  currentStatus,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (newStatus: string) => {
    if (currentStatus === newStatus) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/credit-request/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка при обновлении статуса");
      }

      // Обновляем страницу для отображения нового статуса
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {currentStatus !== "APPROVED" && (
          <Button
            onClick={() => updateStatus("APPROVED")}
            disabled={isSubmitting || currentStatus === "ISSUED" || currentStatus === "CANCELED"}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Одобрить заявку
          </Button>
        )}

        {currentStatus !== "REJECTED" && (
          <Button
            onClick={() => updateStatus("REJECTED")}
            disabled={isSubmitting || currentStatus === "ISSUED" || currentStatus === "CANCELED"}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Отклонить заявку
          </Button>
        )}

        {currentStatus === "APPROVED" && (
          <Button
            onClick={() => updateStatus("ISSUED")}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Выдать кредит
          </Button>
        )}

        {currentStatus !== "CANCELED" && currentStatus !== "ISSUED" && (
          <Button
            onClick={() => updateStatus("CANCELED")}
            disabled={isSubmitting}
            variant="outline"
          >
            Отменить заявку
          </Button>
        )}

        {currentStatus === "REJECTED" && (
          <Button
            onClick={() => updateStatus("PENDING")}
            disabled={isSubmitting}
            variant="outline"
          >
            Вернуть на рассмотрение
          </Button>
        )}
      </div>
    </div>
  );
}; 