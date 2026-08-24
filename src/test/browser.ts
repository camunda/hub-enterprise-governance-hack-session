import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/handlers';

/**
 * MSW browser worker. There is no backend and no toggle — this always
 * intercepts every /api/* call with the fixed, deterministic fixture data.
 */
export const worker = setupWorker(...handlers);
