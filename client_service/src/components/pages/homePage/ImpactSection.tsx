import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/css/ImpactSection.css';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const ImpactSection: React.FC = () => {
  const impactData = [
    {
      icon: '👨‍⚕️',
      number: 150,
      title: 'Verified Doctors',
      description: 'Serving communities across the country',
      class: 'icon-doctor',
    },
    {
      icon: '🩸',
      number: 2000,
      title: 'Blood Donations',
      description: 'Lifesaving moments supported by our donors',
      class: 'icon-donation',
    },
    {
      icon: '🐾',
      number: 12000,
      title: 'Registered Animals',
      description: 'Animals enrolled and cared for via our platform',
      class: 'icon-animal',
    },
    {
      icon: '🤝',
      number: 30,
      title: 'Partner Organizations',
      description: 'Trusted alliances powering our mission',
      class: 'icon-partner',
    },
  ];

  const [counts, setCounts] = useState(impactData.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
        const sectionTop = sectionRef.current?.getBoundingClientRect().top || 0;
        const triggerPoint = window.innerHeight - 100;

        if (sectionTop < triggerPoint) {
        impactData.forEach((data, i) => {
            const start = 0;
            const end = data.number;
            const duration = 2000;
            const frameRate = 30; // frames per second
            const totalFrames = Math.round((duration / 1000) * frameRate);
            const increment = Math.ceil(end / totalFrames);

            let current = start;
            const counter = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(counter);
            }
            setCounts((prev) => {
                const updated = [...prev];
                updated[i] = current;
                return updated;
            });
            }, 1000 / frameRate);
        });

        window.removeEventListener('scroll', handleScroll); // run once
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <div className="impact-section" ref={sectionRef}>
      <VolunteerActivismIcon fontSize="large" className="icon-hand" />
      <h2>Our Impact So Far</h2>
      <div className="impact-cards">
        {impactData.map((item, index) => (
          <div key={index} className={`impact-card ${item.class}`}>
            <div className="impact-icon">{item.icon}</div>
            <h3 className="impact-number">
              {counts[index]}
              {item.number >= 1000 && '+'}
            </h3>
            <p className="impact-title">{item.title}</p>
            <p className="impact-description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactSection;
