import React from 'react';
import '../../../styles/css/Howitworks.css';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import InsertChartOutlinedSharpIcon from '@mui/icons-material/InsertChartOutlinedSharp';
const HowItWorks: React.FC = () => {
  return (
    <div className="how-it-works">
      <h2>How Our Platform Works</h2>
      <div className="steps">
        <div className="step">
          <div className="icon-person"><PersonAddAlt1Icon fontSize='large'/></div>
          <p>Step 1</p>
          <h4>Register</h4>
          <p className='step-desc'>Sign up as a Farmer, Donor, Doctor, or Organization</p>
        </div>
        <div className="step">
          <div className="icon-search"><SearchSharpIcon fontSize='large'/></div>
          <p>Step 2</p>
          <h4 className='add-animal'>Add Animals / Search Donors</h4>
          <p className='step-desc'>Add your animals or find matching donors near you</p>
        </div>
        <div className="step">
          <div className="icon-calendar"><CalendarMonthSharpIcon fontSize='large'/></div>
          <p>Step 3</p>
          <h4>Book Appointments</h4>
          <p className='step-desc'>Schedule vet appointments or blood donations</p>
        </div>
        <div className="step">
          <div className="icon-chart"><InsertChartOutlinedSharpIcon fontSize='large'/></div>
          <p>Step 4</p>
          <h4>Track & Update</h4>
          <p className='step-desc'>Track donations and...</p>
        </div>
      </div>
      <div className='join-section'>
        <button className="join-button">Join Our Platform</button>
      </div>

    </div>
  );
};

export default HowItWorks;
