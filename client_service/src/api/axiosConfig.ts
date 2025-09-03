import axios from 'axios';

const auth_api = axios.create({
  baseURL: 'http://localhost:5011/auth/api/',
  // baseURL: 'http://192.168.68.112:5000/api/',
  withCredentials: true
});

const farmer_api = axios.create({
  baseURL: 'http://localhost:5011/farmer/api/',
  withCredentials: true
});

const doctor_api = axios.create({
  baseURL: 'http://localhost:5011/doctor/api/',
  withCredentials: true
});

const hospital_api = axios.create({
  baseURL: 'http://localhost:5011/hospital/api/',
  withCredentials: true
});

const organization_api = axios.create({
  baseURL: 'http://localhost:5011/organ/api/',
  withCredentials: true
});

const vendor_api = axios.create({
  baseURL: 'http://localhost:5011/vendor/api/',
  withCredentials: true
});

const ae_api = axios.create({
  baseURL: 'http://localhost:5011/animal_enth/api/',
  withCredentials: true
});

const admin_api = axios.create({
  baseURL: 'http://localhost:5011/admin/api/',
  withCredentials: true
});

const payment_api = axios.create({
  baseURL: 'http://localhost:5011/pay/api/',
  withCredentials: true
});

export default {
  auth_api,
  farmer_api,
  doctor_api,
  hospital_api,
  organization_api,
  vendor_api,
  ae_api,
  admin_api,
  payment_api
};
