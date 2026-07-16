import React from 'react';
import { formatAccountingCompact } from '../utils/format';
import './KPICard.css';

const KPICard = ({ title, value, status = 'active' }) => {
  const isPlaceholder = status === 'placeholder';

  // Format value using accounting format
  const isNumeric = value !== null && value !== '' && !isNaN(parseFloat(value));
  const formattedValue = isNumeric
    ? formatAccountingCompact(value)
    : value;

  return (
    <div className={`kpi-card glass ${isPlaceholder ? 'placeholder' : ''}`}>
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
      </div>
      <div className="kpi-body">
        {isPlaceholder ? (
          <div className="kpi-value placeholder-text">Future Module</div>
        ) : (
          <div className="kpi-value">{formattedValue}</div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
