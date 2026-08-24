import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './providers/query-provider';
import { ThemeProvider } from './providers/theme-provider';
import { AppRouter } from './router';

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  );
}
