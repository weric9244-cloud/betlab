'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Bet {
  matchId: string;
  match: {
    homeTeam: string;
    awayTeam: string;
    league: string;
  };
  betType: string;
  selection: any;
  odds: number;
}

interface BetslipContextType {
  betslip: Bet[];
  addToBetslip: (bet: Bet) => void;
  removeFromBetslip: (index: number) => void;
  clearBetslip: () => void;
}

const BetslipContext = createContext<BetslipContextType | undefined>(undefined);

export function BetslipProvider({ children }: { children: React.ReactNode }) {
  const [betslip, setBetslip] = useState<Bet[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('betslip');
    if (saved) {
      try {
        setBetslip(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading betslip from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever betslip changes
  useEffect(() => {
    localStorage.setItem('betslip', JSON.stringify(betslip));
  }, [betslip]);

  const addToBetslip = (bet: Bet) => {
    setBetslip((prev) => [...prev, bet]);
  };

  const removeFromBetslip = (index: number) => {
    setBetslip((prev) => prev.filter((_, i) => i !== index));
  };

  const clearBetslip = () => {
    setBetslip([]);
    localStorage.removeItem('betslip');
  };

  return (
    <BetslipContext.Provider
      value={{
        betslip,
        addToBetslip,
        removeFromBetslip,
        clearBetslip
      }}
    >
      {children}
    </BetslipContext.Provider>
  );
}

export function useBetslip() {
  const context = useContext(BetslipContext);
  if (context === undefined) {
    throw new Error('useBetslip must be used within a BetslipProvider');
  }
  return context;
}

