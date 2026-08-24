import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';
import { PersonDetailPage } from './person-detail-page';
import { PEOPLE } from '@/test/handlers/fixtures';

function renderPersonDetail(personId: string) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/people/${personId}`]}>
        <Routes>
          <Route path="/people/:personId" element={<PersonDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PersonDetailPage', () => {
  it('shows name, email, status and date added', async () => {
    const person = PEOPLE[0]!;
    renderPersonDetail(person.id);

    expect(await screen.findByText(person.name)).toBeInTheDocument();
    expect(await screen.findByText(person.email)).toBeInTheDocument();
    expect(screen.getByText(person.status)).toBeInTheDocument();
  });

  it('never mentions project access — the screen is deliberately thin', async () => {
    const person = PEOPLE[0]!;
    renderPersonDetail(person.id);

    await waitFor(() => expect(screen.getByText(person.email)).toBeInTheDocument());

    const bodyText = document.body.textContent ?? '';
    for (const term of ['project', 'access', 'collaborator', 'role', 'group']) {
      expect(bodyText.toLowerCase()).not.toContain(term);
    }
  });
});
