import '../../../styles/css/FeatureSection.css';

const FeaturesSection: React.FC = () => {
  return (
    <section className="features-section">
      <h2 className="section-title">Our Features</h2>
      <div className="features-grid">
        <div className="feature-card">
          <i className="fa fa-rocket feature-icon" />
          <h3>Rigorous Donor Screening</h3>
          <p>We maintain strict criteria for donor eligibility, including comprehensive health checks, blood typing, and disease screening, to ensure the safety and quality of every blood product.</p>
        </div>
        <div className="feature-card">
          <i className="fa fa-shield feature-icon" />
          <h3>State-of-the-Art Collection Facility</h3>
          <p>Our dedicated collection area is designed to be calm and comfortable for our animal donors, equipped with the latest technology for safe and efficient blood drawing.</p>
        </div>
        <div className="feature-card">
          <i className="fa fa-cogs feature-icon" />
          <h3>Comprehensive Blood Product Inventory</h3>
          <p> We maintain a diverse inventory of blood types for common companion animals (dogs and cats), ensuring readiness for various transfusion needs.</p>
        </div>
        <div className="feature-card">
          <i className="fa fa-headphones feature-icon" />
          <h3>Experienced Veterinary Team</h3>
          <p>Our operations are overseen by experienced veterinary professionals who are experts in transfusion medicine, donor care, and blood product management.</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
