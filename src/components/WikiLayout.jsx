import React from 'react'
import PaginaSidebar from './WikiSidebar'
import PaginaBreadcrumbs from './WikiBreadcrumbs'

const PaginaLayout = ({ children, category, page }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Sidebar */}
  <PaginaSidebar />
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '1rem 2rem',
        maxWidth: 'calc(100vw - 280px)',
        overflowX: 'auto'
      }}>
  <PaginaBreadcrumbs category={category} page={page} />
        
        {/* Content Area */}
        <div style={{
          maxWidth: '800px',
          lineHeight: '1.6',
          fontSize: '1rem'
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PaginaLayout
