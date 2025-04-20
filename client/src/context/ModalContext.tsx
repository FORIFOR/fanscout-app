import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isMatchDetailOpen: boolean;
  selectedMatchId: number | null;
  openMatchDetail: (matchId: number) => void;
  closeMatchDetail: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isMatchDetailOpen, setIsMatchDetailOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  const openMatchDetail = (matchId: number) => {
    setSelectedMatchId(matchId);
    setIsMatchDetailOpen(true);
  };

  const closeMatchDetail = () => {
    setIsMatchDetailOpen(false);
    setSelectedMatchId(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isMatchDetailOpen,
        selectedMatchId,
        openMatchDetail,
        closeMatchDetail
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
