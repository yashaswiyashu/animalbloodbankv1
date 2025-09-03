import { useState } from 'react';
import '../../../styles/css/NewsLetterSection.css';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    alert(`Subscribed with ${email}!`);
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <h2>Subscribe to Our Animal Blood Bank</h2>
      <p>Get the latest updates delivered straight to your inbox.</p>
      <form onSubmit={handleSubscribe} className="newsletter-form">
        <input
          type="email"
          placeholder="Enter your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default NewsletterSection;
