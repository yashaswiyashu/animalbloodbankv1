import '../../../styles/css/TestimonialsSection.css';

const testimonials = [
  {
    name: 'Dr. Rajesh Kumar, Director, K9 & Kitty Clinic',
    text: "The team at [Your Animal Blood Bank Name] is an absolute lifesaver. Their prompt delivery of Packed Red Blood Cells saved 'Buddy' during a complicated surgery. Their professionalism and dedication are truly commendable.",
    image: 'https://w7.pngwing.com/pngs/144/424/png-transparent-shanda-sharer-indian-cuisine-woman-drawing-india-love-food-face-thumbnail.png'
  },
  {
    name: 'Priya S., Pet Owner of Luna',
    text: "When our beloved cat, 'Luna', was diagnosed with severe anemia, we were terrified. Thanks to a timely blood transfusion arranged through [Your Animal Blood Bank Name], Luna made a full recovery. We are eternally grateful for their critical work.",
    image: 'https://static.vecteezy.com/system/resources/previews/051/455/467/non_2x/indian-woman-in-sari-free-png.png'
  },
  {
    name: 'Mike Johnson, Pet Parents and Donors',
    text: "Our dog, 'Max', is a regular blood donor at [Your Animal Blood Bank Name], and the experience is always fantastic. The staff is so caring and gentle with him, and we're proud to be part of a program that saves so many lives.",
    image: 'https://png.pngtree.com/png-vector/20250209/ourmid/pngtree-young-asian-indian-office-professional-in-formal-wear-png-image_15432372.png'
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="testimonials-section">
      <h2 className="section-title">What Our Users Say</h2>
      <div className="testimonials-wrapper">
        {testimonials.map(({ name, text, image }, index) => (
          <div className="testimonial-card" key={index}>
            <img src={image} alt={name} className="testimonial-img" />
            <p className="testimonial-text">"{text}"</p>
            <h4 className="testimonial-name">{name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
