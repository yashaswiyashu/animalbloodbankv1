import axios from 'axios';

const auth_api = axios.create({
  baseURL: 'http://localhost:5000/api/',
  // baseURL: 'http://192.168.68.112:5000/api/',
  withCredentials: true
});

const farmer_api = axios.create({
  baseURL: 'http://localhost:5001/api/',
  withCredentials: true
});

const doctor_api = axios.create({
  baseURL: 'http://localhost:5002/api/',
  withCredentials: true
});

const hospital_api = axios.create({
  baseURL: 'http://localhost:5003/api/',
  withCredentials: true
});

const organization_api = axios.create({
  baseURL: 'http://localhost:5004/api/',
  withCredentials: true
});

const vendor_api = axios.create({
  baseURL: 'http://localhost:5005/api/',
  withCredentials: true
});

const ae_api = axios.create({
  baseURL: 'http://localhost:5006/api/',
  withCredentials: true
});

const admin_api = axios.create({
  baseURL: 'http://localhost:5007/api/',
  withCredentials: true
});

const payment_api = axios.create({
  baseURL: 'http://localhost:5008/api/',
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
