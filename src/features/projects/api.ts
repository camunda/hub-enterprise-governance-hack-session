import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiGet } from '@/shared/api/client';
import type { Collaborator, Page, Project } from '@/shared/domain';

const DEFAULT_PAGE_SIZE = 25;

export function useProjects(search: string, page: number, pageSize = DEFAULT_PAGE_SIZE) {
  return useQuery({
    queryKey: ['projects', 'list', { search, page, pageSize }],
    queryFn: () =>
      apiGet<Page<Project>>('/api/projects', { search: search || undefined, page, pageSize }),
    placeholderData: keepPreviousData,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', 'detail', projectId],
    queryFn: () => apiGet<Project>(`/api/projects/${projectId}`),
    enabled: !!projectId,
  });
}

export function useProjectCollaborators(projectId: string) {
  return useQuery({
    queryKey: ['projects', 'collaborators', projectId],
    queryFn: () => apiGet<Collaborator[]>(`/api/projects/${projectId}/collaborators`),
    enabled: !!projectId,
  });
}
