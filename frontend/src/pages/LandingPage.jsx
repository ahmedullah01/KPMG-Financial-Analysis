import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building, Heart, Factory, ShieldCheck, ArrowRight } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ setAnalysisConfig }) => {
  const navigate = useNavigate();

  const handleIndustrySelect = (industry, active) => {
    if (!active) return;
    setAnalysisConfig(prev => ({ ...prev, industry }));
    navigate('/dashboard');
  };

  const industries = [
    { name: 'Aviation', active: true, icon: <Briefcase size={24} /> },
    { name: 'Banking', active: false, icon: <Building size={24} /> },
    { name: 'Healthcare', active: false, icon: <Heart size={24} /> },
    { name: 'Manufacturing', active: false, icon: <Factory size={24} /> },
    { name: 'Insurance', active: false, icon: <ShieldCheck size={24} /> },
  ];

  return (
    <div className="landing-wrapper">
      {/* Abstract Background Graphic */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      
      <div className="landing-container">
        {/* Navigation/Header Area */}
        <header className="landing-header animate-fade-in">
          <div className="kpmg-logo">KPMG</div>
        </header>

        <div className="landing-content">
          <div className="hero-section animate-fade-in">
            <h1 className="landing-title">Financial Analysis Platform</h1>
            <p className="landing-subtitle">
              Enterprise-grade financial statement modeling, forecasting, and reporting for KPMG Risk & Consulting.
            </p>
          </div>

          <div className="industry-selection animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="section-title">Select Industry Module</h2>
            <div className="industry-grid">
              {industries.map((ind, idx) => (
                <div 
                  key={ind.name}
                  className={`industry-card glass ${ind.active ? 'active' : 'disabled'}`}
                  onClick={() => handleIndustrySelect(ind.name, ind.active)}
                  style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}
                >
                  <div className="card-icon">{ind.icon}</div>
                  <h3>{ind.name}</h3>
                  {ind.active ? (
                    <div className="card-action">
                      <span>Launch</span>
                      <ArrowRight size={16} />
                    </div>
                  ) : (
                    <span className="coming-soon">Coming Soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
