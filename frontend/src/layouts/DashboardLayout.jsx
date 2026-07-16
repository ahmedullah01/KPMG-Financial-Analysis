import React from 'react';
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSpreadsheet, TrendingUp, LogOut } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = ({ industry }) => {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-text">KPMG</div>
          <div className="industry-badge">{industry || 'Select Industry'}</div>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/dashboard/balance-sheet" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FileSpreadsheet size={20} />
            <span>Balance Sheet</span>
          </NavLink>
          <NavLink to="/dashboard/income-statement" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <TrendingUp size={20} />
            <span>Income Statement</span>
          </NavLink>
          <NavLink to="/dashboard/cash-flow-statement" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FileSpreadsheet size={20} />
            <span>Cash Flow</span>
          </NavLink>
          
          <div className="nav-divider"></div>
          
          <Link to="/" className="nav-link logout">
            <LogOut size={20} />
            <span>Exit Analysis</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navigation */}
        <header className="top-nav glass">
          <div className="nav-left">
            <h2>Financial Analysis Platform</h2>
          </div>
          <div className="nav-right">
            <div className="user-profile">
              <div className="avatar">A</div>
              <span>Analyst</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
