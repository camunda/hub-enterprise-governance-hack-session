import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './handlers/handlers';

/**
 * MSW server for tests — same handlers and fixtures as the browser, so
 * tests exercise the real hooks against realistic, deterministic data.
 *
 * Unhandled requests throw rather than bypass, so a missing handler shows
 * up as a failing test instead of a silently-passing one.
 */
export const server = setupServer(...handlers);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: (request, print) => {
      const url = new URL(request.url);
      if (/\.(css|woff2?|ttf|eot|png|jpe?g|svg|ico)$/i.test(url.pathname)) return;
      print.error();
      throw new Error(
        `[MSW] Unhandled ${request.method} ${request.url}. Add a handler in src/test/handlers/ or mock the API call in the test.`,
      );
    },
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
