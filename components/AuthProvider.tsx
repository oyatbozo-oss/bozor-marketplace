'use client';

import { createContext, useContext } from 'react';
import type { SessionUser } from '@/lib/session';

const Ctx = createContext<SessionUser | null>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={user}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
