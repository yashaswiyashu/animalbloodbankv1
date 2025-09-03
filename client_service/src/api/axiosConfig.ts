import axios from 'axios';

const auth_api = axios.create({
  baseURL: 'https://server.pranimithra.in/auth/api/',
  // baseURL: 'http://192.168.68.112:5000/api/',
  withCredentials: true
});

const farmer_api = axios.create({
  baseURL: 'https://server.pranimithra.in/farmer/api/',
  withCredentials: true
});

const doctor_api = axios.create({
  baseURL: 'https://server.pranimithra.in/doctor/api/',
  withCredentials: true
});

const hospital_api = axios.create({
  baseURL: 'https://server.pranimithra.in/hospital/api/',
  withCredentials: true
});

const organization_api = axios.create({
  baseURL: 'https://server.pranimithra.in/organ/api/',
  withCredentials: true
});

const vendor_api = axios.create({
  baseURL: 'https://server.pranimithra.in/vendor/api/',
  withCredentials: true
});

const ae_api = axios.create({
  baseURL: 'https://server.pranimithra.in/animal_enth/api/',
  withCredentials: true
});

const admin_api = axios.create({
  baseURL: 'https://server.pranimithra.in/admin/api/',
  withCredentials: true
});

const payment_api = axios.create({
  baseURL: 'https://server.pranimithra.in/pay/api/',
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
