import { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const location = useLocation();
  
  const sidebarVisible = useMemo(() => {
    return location.pathname.startsWith('/patient-dashboard/');
  }, [location.pathname]);

  const value = {
    sidebarVisible,
    showSidebar: () => {},
    hideSidebar: () => {}
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};