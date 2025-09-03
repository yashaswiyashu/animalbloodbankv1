import '../../../styles/css/heropage.css'
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const HeroSection: React.FC = () => {
  return (
    <div className="container">
      <div className="content">
        <h1>Saving Lives, One Drop at a Time</h1>
        <p>India's First Dedicated Animal Blood Bank Platform for Farmers, Vets, and Donors</p>
        <div className="buttons-hero">
          <button className="find-donor"><SearchIcon/>&nbsp; Find Donor</button>
          <button className="become-donor"><PersonAddIcon/>&nbsp; Become a Donor</button>
          <button className="book-appointment"><CalendarMonthIcon/>&nbsp; Book a Vet Appointment</button>
        </div>
      </div>
      
    </div>
  );
};

export default HeroSection;
