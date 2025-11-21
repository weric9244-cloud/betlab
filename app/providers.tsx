'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { BetslipProvider } from '@/contexts/BetslipContext';
import { WebSocketProvider } from '@/contexts/WebSocketContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BetslipProvider>
        <WebSocketProvider>{children}</WebSocketProvider>
      </BetslipProvider>
    </AuthProvider>
  );
}

