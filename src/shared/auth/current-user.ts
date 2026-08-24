/**
 * There is no login in this app — every session is the same fictional
 * signed-in administrator, resolved synchronously at startup. Kept in a
 * `useCurrentUser()`-shaped accessor so component code reads the same way
 * it would against a real auth layer.
 */

export interface CurrentUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly organizationId: string;
}

const FIXED_USER: CurrentUser = {
  id: 'user-admin',
  name: 'Jordan Ellery',
  email: 'jordan.ellery@northwind-collective.example',
  organizationId: 'org-northwind',
};

export function useCurrentUser(): { readonly data: CurrentUser } {
  return { data: FIXED_USER };
}
