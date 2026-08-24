import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiGet } from '@/shared/api/client';
import type { Page, Person } from '@/shared/domain';

const DEFAULT_PAGE_SIZE = 25;

export function usePeople(search: string, page: number, pageSize = DEFAULT_PAGE_SIZE) {
  return useQuery({
    queryKey: ['people', 'list', { search, page, pageSize }],
    queryFn: () =>
      apiGet<Page<Person>>('/api/users', { search: search || undefined, page, pageSize }),
    placeholderData: keepPreviousData,
  });
}

export function usePerson(personId: string) {
  return useQuery({
    queryKey: ['people', 'detail', personId],
    queryFn: () => apiGet<Person>(`/api/users/${personId}`),
    enabled: !!personId,
  });
}
