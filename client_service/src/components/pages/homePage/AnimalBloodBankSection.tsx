import React, { useRef } from 'react';
import '../../../styles/css/AnimalBloodBankSection.css';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import VolunteerActivismSharpIcon from '@mui/icons-material/VolunteerActivismSharp';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import DomainAddSharpIcon from '@mui/icons-material/DomainAddSharp';
import BiotechSharpIcon from '@mui/icons-material/BiotechSharp';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const AnimalBloodBankSection: React.FC = () => {
  const services = [
    {
      icon: <PetsOutlinedIcon fontSize="large" className="icon-app" />,
      title: 'Add and Manage Animals',
      description: 'Easily register and update animal details',
      class: 'icon-app-holder',
    },
    {
      icon: <VolunteerActivismSharpIcon fontSize="large" className="icon-blood" />,
      title: 'Become an Animal Blood Donor',
      description: 'List your pet as a lifesaving donor',
      class: 'icon-blood-holder',
    },
    {
      icon: <CalendarMonthSharpIcon fontSize="large" className="icon-cal" />,
      title: 'Book Doctor Appointments',
      description: 'Schedule vet visits with just a few clicks',
      class: 'icon-cal-holder',
    },
    {
      icon: <DomainAddSharpIcon fontSize="large" className="icon-hospital" />,
      title: 'Connect with Hospitals & Labs',
      description: 'Find nearby medical partners and services',
      class: 'icon-hosp-holder',
    },
    {
      icon: <BiotechSharpIcon fontSize="large" className="icon-lab" />,
      title: 'Manage Test Reports and Vaccination',
      description: 'Upload and view medical history anytime',
      class: 'icon-lab-holder',
    },
    {
      icon: <ChecklistRtlOutlinedIcon fontSize="large" className="icon-data" />,
      title: 'Track Donation History',
      description: 'See donation status, frequency, and updates',
      class: 'icon-data-holder',
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const scrollAmount = 300;
    if (carouselRef.current) {
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="animal-blood-bank-section">
      <h2 className="section-title">
        <PetsOutlinedIcon /> &nbsp; What You Can Do With Animal Blood Bank &nbsp;
        <PetsOutlinedIcon />
      </h2>

      <div className="carousel-wrapper">
        <button className="nav-button left" onClick={() => scroll('left')}>
          <ArrowBackIosNewIcon />
        </button>

        <div className="service-carousel" ref={carouselRef}>
          <div className="service-track">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className={`icon-placeholder ${service.class}`}>
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <button className="learn-more-button">Learn More</button>
              </div>
            ))}
          </div>
        </div>

        <button className="nav-button right" onClick={() => scroll('right')}>
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
};

export default AnimalBloodBankSection;
