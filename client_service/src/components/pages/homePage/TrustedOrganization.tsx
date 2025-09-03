import React from 'react';
import '../../../styles/css/TrustedOrganization.css';
import rotary from '../../assets/rotary-logo-4006.png';
import spoorti from '../../assets/spoorthi.png';
import rsc from '../../assets/RSCsys.bmp';

const organizations = [
  {
    name: 'Rotary International',
    type: 'NGO',
    logo: rotary,
  },
  {
    name: 'Spoorthidhama Charitable Trust',
    type: 'Trust',
    logo: spoorti,
  },
  {
    name: 'RSC Systems PVT LTD',
    type: 'Private Company',
    logo: rsc,
  },
];

const TrustedOrganizations: React.FC = () => {
  return (
    <div className="trusted-organizations">
      <h2>❤️ Trusted Partner's ❤️</h2>
      <p>We’re proud to be backed by leading organizations</p>
      <div className="organization-cards">
        {organizations.map((org, index) => (
          <div className="organization-card" key={index}>
            <img src={org.logo} alt={`logo`} className="logo" />
            <h2>{org.name}</h2>
            <p className="type">{org.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustedOrganizations;
