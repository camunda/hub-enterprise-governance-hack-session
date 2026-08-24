import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';

/**
 * Pagination footer for server-paginated lists. Always shows the true
 * `total` even though only one page's worth of items has been fetched —
 * the UI never pretends the fetched page is the whole collection.
 */
interface PaginationFooterProps {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly onPageChange: (page: number) => void;
}

export function PaginationFooter({ page, pageSize, total, onPageChange }: PaginationFooterProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="flex items-center justify-between border-t px-3 py-2.5 text-sm text-muted-foreground">
      <span>{total === 0 ? 'No results' : `Showing ${start}–${end} of ${total}`}</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <span className="tabular-nums px-1">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
