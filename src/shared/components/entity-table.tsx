/**
 * EntityTable — dense, virtualized table for large collections.
 *
 * Used for projects and people — anywhere the collection can grow large.
 *
 * Features:
 * - Column definitions with sortable headers
 * - Virtualized rows (only renders visible rows)
 * - Row click handler for navigation
 * - Empty state
 * - Loading skeleton
 * - Keyboard navigation (future)
 *
 * Design principle: prefer dense table/list UX over card grids
 * for large business collections (per architecture guidelines).
 */

import { memo, useCallback, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/shared/ui/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';
import { ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  /** Unique key for this column */
  readonly key: string;
  /** Display header text */
  readonly header: string;
  /** Width (CSS value — 'auto', '200px', '1fr') */
  readonly width?: string;
  /** Render function for cell content */
  readonly render: (item: T) => React.ReactNode;
  /** Whether this column is sortable */
  readonly sortable?: boolean;
  /** Alignment */
  readonly align?: 'left' | 'center' | 'right';
}

export interface EntityTableProps<T> {
  /** Column definitions */
  readonly columns: readonly Column<T>[];
  /** Data rows */
  readonly data: readonly T[];
  /** Unique key extractor */
  readonly getRowKey: (item: T) => string;
  /** Row click handler */
  readonly onRowClick?: (item: T) => void;
  /** Loading state */
  readonly isLoading?: boolean;
  /** Empty state message */
  readonly emptyMessage?: string;
  /** Empty state icon */
  readonly emptyIcon?: React.ReactNode;
  /** Row height in pixels (for virtualization) */
  readonly rowHeight?: number;
  /** Max visible height before scrolling (CSS value) */
  readonly maxHeight?: string;
  /** Current sort column key */
  readonly sortBy?: string;
  /** Sort direction */
  readonly sortDirection?: 'asc' | 'desc';
  /** Sort change handler */
  readonly onSort?: (column: string) => void;
}

export function EntityTable<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No items found',
  emptyIcon,
  rowHeight = 44,
  maxHeight = '600px',
  sortBy,
  sortDirection,
  onSort,
}: EntityTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // `useVirtualizer` rebuilds its internal caches whenever its options
  // object identity changes. Wrapping the size estimator in `useCallback`
  // and passing only primitive inputs (data.length, rowHeight) keeps
  // the config stable across parent re-renders (Phase 2 P20).
  const estimateSize = useCallback(() => rowHeight, [rowHeight]);
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 10,
  });

  const gridTemplate = useMemo(
    () => columns.map((c) => c.width ?? '1fr').join(' '),
    [columns],
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-11 w-full rounded-md" />
        ))}
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        {emptyIcon}
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      {/* Header */}
      <div
        className="grid items-center gap-4 border-b bg-muted/30 px-3"
        style={{ gridTemplateColumns: gridTemplate, height: `${rowHeight}px` }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className={cn(
              'flex items-center gap-1 text-xs font-medium text-muted-foreground select-none',
              col.align === 'right' && 'justify-end',
              col.align === 'center' && 'justify-center',
              col.sortable && 'cursor-pointer hover:text-foreground transition-colors',
            )}
            onClick={() => col.sortable && onSort?.(col.key)}
          >
            {col.header}
            {col.sortable && sortBy === col.key && (
              <ArrowUpDown className={cn('size-3', sortDirection === 'desc' && 'rotate-180')} />
            )}
          </div>
        ))}
      </div>

      {/* Virtualized rows */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ maxHeight }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = data[virtualRow.index];
            if (!item) return null;
            return (
              <EntityTableRow
                key={getRowKey(item)}
                item={item}
                columns={columns}
                gridTemplate={gridTemplate}
                rowHeight={rowHeight}
                offset={virtualRow.start}
                onRowClick={onRowClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized row component. Previously the row JSX was inlined inside the
 * virtualizer loop, which meant every row re-rendered whenever the parent
 * `EntityTable` re-rendered (including on sort, filter keystrokes, and
 * data-prop identity changes from callers that didn't memoize their
 * arrays). Pulling the row out and wrapping in `memo` keeps only the
 * visible window of rows repainting during typical interactions.
 *
 * Prop identity rules:
 *   - `item` should be a reference-stable object produced by the server
 *     query cache. TanStack Query guarantees this when the underlying
 *     data hasn't changed.
 *   - `columns` and `onRowClick` must be memoized by the caller with
 *     `useMemo` / `useCallback` for `memo` to be effective. Unstable
 *     references will cause a full re-render cascade identical to the
 *     pre-memo state.
 */
interface EntityTableRowProps<T> {
  readonly item: T;
  readonly columns: readonly Column<T>[];
  readonly gridTemplate: string;
  readonly rowHeight: number;
  readonly offset: number;
  readonly onRowClick?: (item: T) => void;
}

function EntityTableRowInner<T>({
  item,
  columns,
  gridTemplate,
  rowHeight,
  offset,
  onRowClick,
}: EntityTableRowProps<T>): React.ReactElement {
  const handleClick = useCallback(() => {
    onRowClick?.(item);
  }, [item, onRowClick]);

  return (
    <div
      className={cn(
        'grid items-center gap-4 px-3 border-b border-border/30 transition-colors',
        onRowClick && 'cursor-pointer hover:bg-muted/30',
      )}
      style={{
        gridTemplateColumns: gridTemplate,
        height: `${rowHeight}px`,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translateY(${offset}px)`,
      }}
      onClick={onRowClick ? handleClick : undefined}
    >
      {columns.map((col) => (
        <div
          key={col.key}
          className={cn(
            'text-sm truncate',
            col.align === 'right' && 'text-right',
            col.align === 'center' && 'text-center',
          )}
        >
          {col.render(item)}
        </div>
      ))}
    </div>
  );
}

const EntityTableRow = memo(EntityTableRowInner) as typeof EntityTableRowInner;
