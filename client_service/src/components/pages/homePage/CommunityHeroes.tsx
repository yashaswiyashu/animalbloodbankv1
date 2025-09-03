import React, { useRef } from 'react';
import '../../../styles/css/CommunityHeroes.css';
import { useNavigate } from 'react-router-dom';
import shashidhar from "../heros/assets/shashidhar.png"

const stakeholders = [
  {
    name: "Dr. H E. Shashidhar",
    role: "Professor",
    description: "Professor (Genetics, Plant Breeding & Biotechnology),College of Agriculture, Gandhi Krishi Vigyana Kendra",
    imgSrc: shashidhar,
    route: "person"
  },
  {
    name: "Max & Luna",
    role: "Donor",
    description: "Regular donors helping save lives.",
    imgSrc: "https://picsum.photos/seed/dogs1/300/300",
    route: "person"
  },
  {
    name: "Paws For Life",
    role: "NGO",
    description: "Connecting donors with animals in need.",
    imgSrc: "https://picsum.photos/seed/ngo1/300/300",
    route: "person"
  },
  {
    name: "James Wilson",
    role: "Pet Parent",
    description: "Proud parent of three donor dogs.",
    imgSrc: "https://picsum.photos/seed/owner1/300/300",
    route: "person"
  },
  {
    name: "Dr. Emily Chen",
    role: "Doctor",
    description: "Expert in blood transfusion medicine.",
    imgSrc: "https://picsum.photos/seed/doctor2/300/300",
    route: "person"
  },
  {
    name: "Bella & Charlie",
    role: "Donor",
    description: "First-time donors making a difference.",
    imgSrc: "https://picsum.photos/seed/puppies1/300/300",
    route: "person"
  },
];

const CommunityHeroes: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

   const goToProfile = (route: string) => {
        navigate(`/${route}`);
    };

  return (
    <div className="community-heroes">
      <h2>Our Community Heroes</h2>
      <p>Meet the dedicated individuals and organizations saving lives through animals.</p>

      <div className="carousel-controls">
        <button className="carousel-btn left" onClick={() => scroll('left')}>&lt;</button>

        <div className="heroes-carousel" ref={carouselRef}>
          {stakeholders.map((hero, index) => (
            <div key={index} className="hero-card" onClick={() => goToProfile(hero.route)}>
              <img src={hero.imgSrc} alt={hero.name} className="hero-image" />
              <div className="hero-info">
                <span className={`hero-role role-${hero.role.replace(/\s/g, '').toLowerCase()}`}>
                  {hero.role}
                </span>
                <h3>{hero.name}</h3>
                <p>{hero.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-btn right" onClick={() => scroll('right')}>&gt;</button>
      </div>
    </div>
  );
};

export default CommunityHeroes;
