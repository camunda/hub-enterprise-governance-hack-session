/**
 * Route Configuration — single source of truth for all URL patterns.
 * Always navigate via these functions, never string-concatenate a route.
 */

export const routes = {
  projects: '/projects',
  project: (projectId: string) => `/projects/${projectId}`,
  people: '/people',
  person: (personId: string) => `/people/${personId}`,
};

export const routePatterns = {
  projects: '/projects',
  project: '/projects/:projectId',
  people: '/people',
  person: '/people/:personId',
};
