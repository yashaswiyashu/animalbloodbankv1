import React from 'react';
import '../../../styles/css/PersonPage.css';
import Navbar from '../homePage/Navbar';
import shashidhar from "./assets/shashidhar.png"
import project from "./assets/project-img.png"
import project1 from "./assets/project1.png"
import project2 from "./assets/project2.png"
import project3 from "./assets/project3.png"
import project4 from "./assets/project4.png"
import project5 from "./assets/project5.png"

const PersonPage: React.FC = () => {
  return (
    <>
        <Navbar/>
    <div className='center-page'>
        <div className="profile-page">
        <div className="header">
            <img src={shashidhar} alt="Dr. H E Shashidhar" className="profile-pic" />
            <h1>Dr. H E Shashidhar</h1>
            <div className="tags">
            <span className="tag">Professor Eminence</span>
            <span className="tag tag-active">Genetics, Plant Breeding & Biotechnology</span>
            </div>
        </div>

        <section className="about">
            <h2>About</h2>
            <p>
            Dr. H E Shashidhar is a globally respected professor and scientist specializing in Genetics, Plant Breeding, 
            Drought Resistance in Rice, and Molecular Biotechnology. With over 40 years of academic, research, and 
            entrepreneurial leadership, he’s been a driving force in agricultural innovation and has guided 100+ Masters 
            and 30+ Ph.D. scholars.
            </p>
            <blockquote>
            <p>“Science is about curiosity, discipline, and vision — and through agricultural biotechnology, we can secure 
            the future of food and farming under climate uncertainty.”</p>
            </blockquote>
        </section>

        <section className="stats">
            <div className="stat">
            <h3>52</h3>
            <p>Papers Published</p>
            </div>
            <div className="stat">
            <h3>30</h3>
            <p>Ph.D. Students Guided</p>
            </div>
            <div className="stat">
            <h3>20+</h3>
            <p>International Conferences</p>
            </div>
            <div className="stat">
            <h3>12</h3>
            <p>Major Research Projects</p>
            </div>
        </section>

        <section className="gallery">
            <h2>Gallery</h2>
            <div className="gallery-grid">
            <img src={project} alt="Field Research" />
            <img src={project1} alt="Drought Research" />
            <img src={project2} alt="Rice Field Project" />
            <img src={project3} alt="Conference Presentation" />
            <img src={project4} alt="Team Workshop" />
            <img src={project5} alt="Lab Work" />
            </div>
        </section>

        <section className="achievements">
            <h2>Achievements & Recognition</h2>
            <div className="achievement">
            <h3>State Award for Scientists</h3>
            <p>Recognized for decades of outstanding contributions in drought resistance research in rice.</p>
            </div>
            <div className="achievement">
            <h3>Rice Biotechnology Research Leadership</h3>
            <p>Pioneered multiple international collaborations with IRRI, Philippines, and Rockefeller Foundation.</p>
            </div>
            <div className="achievement">
            <h3>Breakthrough: Growing Rice in Abu Dhabi Desert</h3>
            <p>Successfully cultivated rice on sand under desert conditions in 2018, a remarkable innovation milestone.</p>
            </div>
        </section>

        <section className="contact">
            <h2>Contact Information</h2>
            <p>
            📧 <a href="mailto:heshashidhar@gmail.com">heshashidhar@gmail.com</a><br />
            📞 +91 9886319919<br />
            🔗 <a href="https://scholar.google.co.in/citations?user=-oYp0dEAAAAJ&hl=en" target="_blank" rel="noreferrer">Google Scholar Profile</a><br />
            📺 <a href="https://www.youtube.com/watch?v=QGTptGMQ8F8" target="_blank" rel="noreferrer">International Conference Video</a>
            </p>
        </section>

        <footer className='footer-section1'>
            <p>© 2025 Animal Blood Bank. All rights reserved.</p>
        </footer>
        </div>
    </div>
    </>
  );
};

export default PersonPage;
