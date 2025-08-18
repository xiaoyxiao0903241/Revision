import { createContext, useContext, useState, ReactNode } from 'react';
import { Header } from './header';
import { MobileSidebar } from './mobile-sidebar';

interface MobileSidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const MobileSidebarContext = createContext<
  MobileSidebarContextType | undefined
>(undefined);

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext);
  if (context === undefined) {
    throw new Error(
      'useMobileSidebar must be used within a MobileSidebarProvider'
    );
  }
  return context;
}

interface MobileSidebarProviderProps {
  children: ReactNode;
}

export function MobileSidebarProvider({
  children,
}: MobileSidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  return (
    <MobileSidebarContext.Provider
      value={{ isOpen, openSidebar, closeSidebar }}
    >
      <Header onMenuClick={openSidebar} />
      {children}
      <MobileSidebar isOpen={isOpen} onClose={closeSidebar} />
    </MobileSidebarContext.Provider>
  );
}
