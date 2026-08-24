/**
 * SearchInput — reusable search bar with debounced input.
 *
 * Used at the top of all collection views (projects, people).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/shared/ui/input';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  /** Placeholder text */
  readonly placeholder?: string;
  /** Called with debounced search term (300ms) */
  readonly onSearch: (query: string) => void;
  /** Initial value */
  readonly defaultValue?: string;
  /** Debounce delay in ms */
  readonly debounce?: number;
  /** Additional className */
  readonly className?: string;
}

export function SearchInput({
  placeholder = 'Search...',
  onSearch,
  defaultValue = '',
  debounce = 300,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    const timer = setTimeout(() => onSearchRef.current(value), debounce);
    return () => clearTimeout(timer);
  }, [value, debounce]);

  const clear = useCallback(() => {
    setValue('');
    onSearchRef.current('');
  }, []);

  return (
    <div className={`relative ${className ?? ''}`}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8 h-9"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
