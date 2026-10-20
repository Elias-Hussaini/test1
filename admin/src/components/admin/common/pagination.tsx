import { ChevronLeft, ChevronRight } from "lucide-react";
import { faNumber } from "@/lib/format";
import { Button } from "./controls";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onChange: (page: number) => void;
  disabled?: boolean;
};

export function Pagination({ page, totalPages, total, onChange, disabled }: PaginationProps) {
  if (total === 0) return null;
  return (
    <nav aria-label="صفحه‌بندی" className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
      <p className="text-xs text-muted-foreground">
        صفحه {faNumber(page)} از {faNumber(Math.max(totalPages, 1))} · {faNumber(total)} مورد
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={disabled || page <= 1} onClick={() => onChange(page - 1)} aria-label="صفحه‌ی قبل">
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
          قبلی
        </Button>
        <Button variant="secondary" size="sm" disabled={disabled || page >= totalPages} onClick={() => onChange(page + 1)} aria-label="صفحه‌ی بعد">
          بعدی
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
