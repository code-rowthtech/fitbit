import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useSidebar } from '../contexts/SidebarContext';

const Layout = ({ children, pageName }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { sidebarVisible } = useSidebar();

  return (
    <div className="d-flex flex-column" style={{ height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <TopBar pageName={pageName} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <div className="d-flex" style={{ marginTop: '57px', height: 'calc(100vh - 57px)' }}>
        {sidebarVisible && (
          <div style={{ position: 'fixed', left: 0, top: '57px', bottom: 0, zIndex: 999 }}>
            <Sidebar isCollapsed={isCollapsed} />
          </div>
        )}
        <Container 
          fluid 
          className="main-content p-0" 
          style={{ 
            marginLeft: sidebarVisible ? (isCollapsed ? '80px' : '250px') : '0px',
            overflowY: 'auto',
            height: '100%'
          }}
        >
          {children}
        </Container>
      </div>
    </div>
  );
};

export default Layout;