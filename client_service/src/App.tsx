import './styles/forms.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/pages/register/Login';
import Register from './components/pages/register/Register';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import FarmerDashboard from './components/pages/farmer/FarmerDashboard';
import PrivateRoute from './routes/PrivateRoute';
import ProductDashboard from './components/pages/product/ProductDashboard';
import OrderDashboard from './components/pages/order/OrderDashboard';
import VendorOverviewDashboard from './components/pages/vendor/VendorDashboard';
import HomePage from './components/HomePage';
import DoctorList from './components/pages/farmer/DoctorList';
import DoctorProfile from './components/pages/farmer/DoctorProfile';
import DoctorDashboard from './components/pages/doctor/DoctorDashboard';
import OrganisationDashboard from './components/pages/organisation/OrganisationDashboard';
import AnimalEnthusiasts from './components/pages/enthusiasts/AnimalEnthusiastsDashboard';
import OrganisationAddImg from './components/pages/organisation/OrganisationAddImagesPage';
import OrganisationAddDesc from './components/pages/organisation/OrganisationAddDescription';
import HospitalDashboard from './components/pages/hospital/HospitalDashboard';
import HospitalAddImg from './components/pages/hospital/HospitalAddImagePage';
import HospitalAddDesc from './components/pages/hospital/HospitalAddDescription';
import HospitalList from './components/pages/farmer/FarmerHospitalList';
import ProfilePage from './components/pages/enthusiasts/EnthusiastViewProfilePage'
import FarmerMyBooking from './components/pages/farmer/FarmerMyBookings';
import VideoCall from './components/pages/videoCall/VideoCall';
import PersonPage from './components/pages/heros/PersonPage';
import StoriesOfHope from './components/pages/videoGallery/StoriesOfHope';
import LabDashboard from './components/pages/lab/LabDashboard';
import LabList from './components/pages/farmer/LabList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/person" element={<PersonPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stories" element={<StoriesOfHope />} />
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin', 'doctor', 'hospital', 'pharmacy', 'lab', 'organisation', 'Animal Enthusiasts']}>
              <AdminDashboard />
            </PrivateRoute>
          }/>
          <Route path='/my-bookings' element={<FarmerMyBooking />} />
          <Route path='/video-call' element={<VideoCall />} />
          <Route path="/labs" element={<LabList />} />
          <Route path="/farmer" element={
            <PrivateRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </PrivateRoute>
          }/>

          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />  
          <Route path="/product" element={
            <PrivateRoute allowedRoles={['vendor']}>
              <ProductDashboard />
            </PrivateRoute>
          }/>

          <Route path="organisation-img" element={<OrganisationAddImg />} />
          <Route path="organisation-desc" element={<OrganisationAddDesc />} />
          <Route path="/organisation" element={
            <PrivateRoute allowedRoles={['organisation']}>
              <OrganisationDashboard />
            </PrivateRoute>
          }/>
          <Route path='formar-hospital-list' element={<HospitalList />} />
          <Route path="hospital-img" element={<HospitalAddImg />} />
          <Route path="hospital-desc" element={<HospitalAddDesc />} />
          <Route path="/hospital" element={
            <PrivateRoute allowedRoles={['hospital','doctor']}>
              <HospitalDashboard />
            </PrivateRoute>
          }/>

          <Route path="/order" element={
            <PrivateRoute allowedRoles={['vendor']}>
              <OrderDashboard />
            </PrivateRoute>
          }/>

          <Route path="/vendor" element={
            <PrivateRoute allowedRoles={['vendor']}>
              <VendorOverviewDashboard />
            </PrivateRoute>
          }/>
          
          <Route path="/profile/:type/:id" element={<ProfilePage />} />
          <Route path="/enthusiasts" element={
            <PrivateRoute allowedRoles={['Animal Enthusiasts']}>
              <AnimalEnthusiasts />
            </PrivateRoute>
          }/>

          <Route path='/lab' element={
            <PrivateRoute allowedRoles={['lab']}>
              <LabDashboard />
            </PrivateRoute>
          }/>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
