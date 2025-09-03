import React, { useEffect, useState, useContext } from "react";
import api from "../../../api/axiosConfig";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../../styles/forms.css";
import "../../../styles/dashboard.css";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BiotechIcon from "@mui/icons-material/Biotech";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AdminInfo from "./AdminInfo";
import AdminDataTable from "./AdminDataTable";
import OrdersSection from "./AppointmentSection";
import PaymentsSection from "./PaymentSection";
import "./admin.css"
import AppointmentSection from "./AppointmentSection";
import DonorRequestsSection from "./DonarRequestSection";

interface User {
  _id: string;
  user_name?: string;
  user_email?: string;
  user_role?: string;
  user_phone?: string;
  city?: string;
  taluk?: string;
  district?: string;
  state?: string;
  country?: string;
  pin_code?: string;
  farmer_name?: string;
  farmer_phone?: string;
  farmer_city?: string;
  farmer_taluk?: string;
  farmer_district?: string;
  farmer_state?: string;
  farmer_country?: string;
  farmer_pin_code?: string;
  farmer_role?: string;
  govt_id_number?: string;
  gst_number?: string;
  govt_id_image?: string;
  specialization?: string;
  hospital_id?: string;
  organisation_id?: string;
  approved?: boolean;
}

interface Animal {
  _id: string;
  type: string;
  species: string;
  breed: string;
  name: string;
  age: number;
  bloodGroup: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  praniAadharNumber: string;
  farmerId: string;
}

interface GetUsersResponse {
  message: string;
  users: User[];
  hospitals?: User[];
  doctors?: User[];
}

interface GetAnimalsResponse {
  message: string;
  animals: Animal[];
}

interface EditFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  role: string;
  specialization?: string;
  govt_id_number?: string;
  govt_id_image?: File | null;
  approved?: boolean;
}

interface NewUserFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  password: string;
  role: string;
  govt_id_number?: string;
  gst_number?: string;
  govt_id_image?: File | null;
  specialization?: string;
  approved?: boolean;
}

interface AnimalFormData {
  type: string;
  species: string;
  breed: string;
  name: string;
  age: string;
  bloodGroup: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
}

interface HospitalFormData {
  user_name: string;
  user_password: string;
  user_phone: string;
  user_email: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  organisation_id: string;
  approved?: boolean;
}

interface DoctorFormData {
  user_name: string;
  user_password: string;
  user_email: string;
  user_phone: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  govt_id: string;
  govt_id_image: File | null;
  hospital_id: string;
  specialization: string;
  approved?: boolean;
}


const roles = [
  "admin",
  "doctor",
  "hospital",
  "pharmacy",
  "lab",
  "organisation",
  "farmer",
  "vendor",
  "Animal Enthusiasts",
];

const AdminDashboard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedFarmer, setExpandedFarmer] = useState<string | null>(null);
  const [expandedOrganisation, setExpandedOrganisation] = useState<
    string | null
  >(null);
  const [farmerAnimals, setFarmerAnimals] = useState<{
    [key: string]: Animal[];
  }>({});
  const [organisationHospital, setOrganisationHospital] = useState<{
    [key: string]: User[];
  }>({});
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [animalFormData, setAnimalFormData] = useState<AnimalFormData>({
    type: "",
    species: "",
    breed: "",
    name: "",
    age: "",
    bloodGroup: "",
    city: "",
    taluk: "",
    district: "",
    state: "",
    country: "",
    pin_code: "",
  });
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    taluk: "",
    district: "",
    state: "",
    country: "",
    pin_code: "",
    role: "",
  });
  const [newUserForm, setNewUserForm] = useState<NewUserFormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    taluk: "",
    district: "",
    state: "",
    country: "",
    pin_code: "",
    password: "",
    role: "admin",
    govt_id_number: "",
    gst_number: "",
    govt_id_image: null,
    specialization: "",
    approved: false,
  });
  const [hospitalFormData, setHospitalFormData] = useState<HospitalFormData>({
    user_name: "",
    user_password: "",
    user_phone: "",
    user_email: "",
    city: "",
    taluk: "",
    district: "",
    state: "",
    country: "",
    pin_code: "",
    organisation_id: "",
    approved: false,
  });
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [editingHospital, setEditingHospital] = useState<User | null>(null);
  const [showDoctorTableId, setShowDoctorTableId] = useState<string | null>(
    null
  );
  const [doctorsByHospital, setDoctorsByHospital] = useState<{
    [hospitalId: string]: User[];
  }>({});
  const [isAddingDoctorForHospitalId, setIsAddingDoctorForHospitalId] =
    useState<string | null>(null);
  const [doctorFormData, setDoctorFormData] = useState<DoctorFormData>({
    user_name: "",
    user_password: "",
    user_email: "",
    user_phone: "",
    city: "",
    taluk: "",
    district: "",
    state: "",
    country: "",
    pin_code: "",
    govt_id: "",
    govt_id_image: null,
    hospital_id: "",
    specialization: "",
    approved: false,
  });

  const [showHospitalDoctorTableId, setShowHospitalDoctorTableId] = useState<
    string | null
  >(null);
  const [doctorsForHospital, setDoctorsForHospital] = useState<{
    [hospitalId: string]: User[];
  }>({});
  const [editingDoctor, setEditingDoctor] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("users");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setActiveTab("users");
    setDropdownOpen(false);
  };

  const fetchUsers = async (role: string) => {
    setLoading(true);
    try {
      const res = await api.admin_api.get<GetUsersResponse>(
        `/auth/get-users/${role}`
      );
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(selectedRole);
  }, [selectedRole]);

  const handleLogout = () => {
    if (context) {
      context.logout();
      navigate("/login");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.user_name || user.farmer_name || "",
      email: user.user_email || "",
      phone: user.user_phone || user.farmer_phone || "",
      city: user.city || user.farmer_city || "",
      taluk: user.taluk || user.farmer_taluk || "",
      district: user.district || user.farmer_district || "",
      state: user.state || user.farmer_state || "",
      country: user.country || user.farmer_country || "",
      pin_code: user.pin_code || user.farmer_pin_code || "",
      role: user.user_role || user.farmer_role || "",
      specialization: user.specialization,
      govt_id_number: user.govt_id_number,
      govt_id_image: null,
      approved: user.approved ?? false,
    });
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const isFarmer = selectedRole === "farmer";
      const endpoint = isFarmer ? "/farmer" : "/user";
      await api.admin_api.delete(`/auth${endpoint}/${user._id}`);
      await fetchUsers(selectedRole);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setNewUserForm((prev) => ({
      ...prev,
      role,
      email: role === "farmer" ? "" : prev.email,
    }));
  };

  const handleNewUserInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "role") {
      setSelectedRole(value);
      setNewUserForm((prev) => ({
        ...prev,
        [name]: value,
        email: value === "farmer" ? "" : prev.email,
      }));
    } else {
      setNewUserForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isFarmer = newUserForm.role === "farmer";
      const isDoctor = newUserForm.role === "doctor";
      const isLab = newUserForm.role === "lab";
      const endpoint = isFarmer ? "/auth/registerFarmer" : "/auth/register";

      let payload;
      let config;

      if (isFarmer) {
        payload = {
          farmer_name: newUserForm.name,
          farmer_phone: newUserForm.phone,
          farmer_city: newUserForm.city,
          farmer_taluk: newUserForm.taluk,
          farmer_district: newUserForm.district,
          farmer_state: newUserForm.state,
          farmer_country: newUserForm.country,
          farmer_pin_code: newUserForm.pin_code,
          farmer_password: newUserForm.password,
          farmer_role: newUserForm.role,
        };
        config = {
          headers: { "Content-Type": "application/json" },
        };
      } else {
        const formData = new FormData();
        formData.append("user_name", newUserForm.name);
        formData.append("user_email", newUserForm.email);
        formData.append("user_phone", newUserForm.phone);
        formData.append("city", newUserForm.city);
        formData.append("taluk", newUserForm.taluk);
        formData.append("district", newUserForm.district);
        formData.append("state", newUserForm.state);
        formData.append("country", newUserForm.country);
        formData.append("pin_code", newUserForm.pin_code);
        formData.append("user_password", newUserForm.password);
        formData.append("user_role", newUserForm.role);
        formData.append("approved", newUserForm.approved ? "true" : "false");
        if (isDoctor) {
          formData.append("specialization", newUserForm.specialization || "");
          formData.append("govt_id_number", newUserForm.govt_id_number || "");
          if (newUserForm.govt_id_image) {
            formData.append("govt_id_image", newUserForm.govt_id_image);
          }
        }

        if (isLab) {
          formData.append("gst_number", newUserForm.gst_number || "");
        }

        payload = formData;
        config = {
          headers: { "Content-Type": "multipart/form-data" },
        };
      }

      await api.admin_api.post(endpoint, payload, config);

      await fetchUsers(selectedRole);
      setShowAddModal(false);
      setNewUserForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        taluk: "",
        district: "",
        state: "",
        country: "",
        pin_code: "",
        password: "",
        role: "admin",
        govt_id_number: "",
        gst_number: "",
        govt_id_image: null,
        approved: false,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isFarmer = selectedRole === "farmer";
      const endpoint = isFarmer
        ? `/auth/farmer/${editingUser?._id}`
        : `/auth/user/${editingUser?._id}`;

      const payload = isFarmer
        ? {
          farmer_name: editFormData.name,
          farmer_phone: editFormData.phone,
          farmer_city: editFormData.city,
          farmer_taluk: editFormData.taluk,
          farmer_district: editFormData.district,
          farmer_state: editFormData.state,
          farmer_country: editFormData.country,
          farmer_pin_code: editFormData.pin_code,
        }
        : {
          user_name: editFormData.name,
          user_email: editFormData.email,
          user_phone: editFormData.phone,
          city: editFormData.city,
          taluk: editFormData.taluk,
          district: editFormData.district,
          state: editFormData.state,
          country: editFormData.country,
          pin_code: editFormData.pin_code,
          approved: editFormData.approved,
        };

      await api.admin_api.put(endpoint, payload);
      await fetchUsers(selectedRole);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const fetchFarmerAnimals = async (farmerId: string) => {
    try {
      const res = await api.admin_api.get<GetAnimalsResponse>(
        `/animal/get-animals-admin/${farmerId}`
      );
      setFarmerAnimals((prev) => ({
        ...prev,
        [farmerId]: res.data.animals,
      }));
    } catch (error) {
      console.error("Error fetching farmer animals:", error);
    }
  };

  const handleExpandFarmer = async (farmerId: string) => {
    if (expandedFarmer === farmerId) {
      setExpandedFarmer(null);
    } else {
      setExpandedFarmer(farmerId);
      if (!farmerAnimals[farmerId]) {
        await fetchFarmerAnimals(farmerId);
      }
    }
  };

  const fetchOrgHospitals = async (organisationId: string) => {
    try {
      const res = await api.organization_api.get<GetUsersResponse>(
        `/hospitals/get-hospitals/${organisationId}`
      );
      setOrganisationHospital((prev) => ({
        ...prev,
        [organisationId]: res.data.hospitals || [],
      }));
    } catch (error) {
      console.error("Error fetching organisation hospitals:", error);
    }
  };

  const handleExpandOrganisation = async (organisationId: string) => {
    if (expandedOrganisation === organisationId) {
      setExpandedOrganisation(null);
    } else {
      setExpandedOrganisation(organisationId);
      if (!organisationHospital[organisationId]) {
        await fetchOrgHospitals(organisationId);
      }
    }
  };

  // Temporary workaround - filter doctors from all users
  const fetchHospitalDoctors = async (hospitalId: string) => {
    try {
      const allUsers = await api.admin_api.get<GetUsersResponse>(
        "/auth/get-users/doctor"
      );
      const doctors = allUsers.data.users.filter(
        (user) => user.hospital_id === hospitalId
      );
      setDoctorsByHospital((prev) => ({
        ...prev,
        [hospitalId]: doctors,
      }));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleExpandDoctors = async (hospitalId: string) => {
    if (showDoctorTableId === hospitalId) {
      setShowDoctorTableId(null);
    } else {
      setShowDoctorTableId(hospitalId);
      if (!doctorsByHospital[hospitalId]) {
        await fetchHospitalDoctors(hospitalId);
      }
    }
  };

  const handleAnimalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAnimalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetAnimalForm = () => {
    setAnimalFormData({
      type: "",
      species: "",
      breed: "",
      name: "",
      age: "",
      bloodGroup: "",
      city: "",
      taluk: "",
      district: "",
      state: "",
      country: "",
      pin_code: "",
    });
    setIsAddingAnimal(false);
    setEditingAnimal(null);
  };

  const handleAnimalSubmit = async (e: React.FormEvent, farmerId: string) => {
    e.preventDefault();
    try {
      if (editingAnimal) {
        await api.admin_api.put(
          `/animal/admin/animals/${editingAnimal._id}`,
          animalFormData
        );
      } else {
        await api.admin_api.post("/animal/addByAdmin", {
          ...animalFormData,
          farmerId,
        });
      }
      await fetchFarmerAnimals(farmerId);
      resetAnimalForm();
    } catch (error) {
      console.error("Error saving animal:", error);
      alert("Failed to save animal");
    }
  };

  const handleAnimalDelete = async (animalId: string, farmerId: string) => {
    if (window.confirm("Are you sure you want to delete this animal?")) {
      try {
        await api.admin_api.delete(`/animal/admin/animals/${animalId}`);
        await fetchFarmerAnimals(farmerId);
      } catch (error) {
        console.error("Error deleting animal:", error);
        alert("Failed to delete animal");
      }
    }
  };

  const handleAnimalEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setAnimalFormData({
      type: animal.type,
      species: animal.species,
      breed: animal.breed,
      name: animal.name,
      age: animal.age.toString(),
      bloodGroup: animal.bloodGroup,
      city: animal.city,
      taluk: animal.taluk,
      district: animal.district,
      state: animal.state,
      country: animal.country,
      pin_code: animal.pin_code,
    });
  };

  const handleHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("user_name", hospitalFormData.user_name);
      data.append("user_phone", hospitalFormData.user_phone);
      data.append("user_email", hospitalFormData.user_email);
      data.append("city", hospitalFormData.city);
      data.append("taluk", hospitalFormData.taluk);
      data.append("district", hospitalFormData.district);
      data.append("state", hospitalFormData.state);
      data.append("country", hospitalFormData.country);
      data.append("pin_code", hospitalFormData.pin_code);
      data.append("approved", doctorFormData.approved ? "true" : "false");
      if (editingHospital) {
        await api.organization_api.put(
          `/hospitals/update-hospital/${editingHospital._id}`,
          hospitalFormData
        );
        alert("Hospital updated successfully!");
      } else {
        data.append("user_password", hospitalFormData.user_password);
        data.append("user_role", "hospital");
        data.append("organisation_id", hospitalFormData.organisation_id);
        await api.admin_api.post("/auth/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Hospital registered successfully!");
      }

      if (expandedOrganisation) {
        await fetchOrgHospitals(expandedOrganisation);
      }
      setIsAddingHospital(false);
      setEditingHospital(null);
    } catch (error) {
      console.error("Error:", error);
      alert(editingHospital ? "Update failed" : "Registration failed");
    }
  };

  const handleDeleteHospital = async (hospitalId: string) => {
    if (!window.confirm("Are you sure you want to delete this hospital?"))
      return;

    try {
      await api.admin_api.delete(`/hospitals/delete-hospital/${hospitalId}`);
      alert("Hospital deleted successfully");
      if (expandedOrganisation) {
        await fetchOrgHospitals(expandedOrganisation);
      }
    } catch (error) {
      console.error("Error deleting hospital:", error);
      alert("Failed to delete hospital");
    }
  };

  // Add this function to handle doctor edit
  const handleDoctorEdit = (doctor: User) => {
    setEditingDoctor(doctor);
    setDoctorFormData({
      user_name: doctor.user_name || "",
      user_password: "",
      user_email: doctor.user_email || "",
      user_phone: doctor.user_phone || "",
      city: doctor.city || "",
      taluk: doctor.taluk || "",
      district: doctor.district || "",
      state: doctor.state || "",
      country: doctor.country || "",
      pin_code: doctor.pin_code || "",
      govt_id: doctor.govt_id_number || "",
      govt_id_image: null,
      hospital_id: doctor.hospital_id || "",
      specialization: doctor.specialization || "",
      approved: doctor.approved || false,
    });
  };

  // Update the doctor submit handler to handle both add and edit
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("user_name", doctorFormData.user_name);
      data.append("user_email", doctorFormData.user_email);
      data.append("user_phone", doctorFormData.user_phone);
      data.append("city", doctorFormData.city);
      data.append("taluk", doctorFormData.taluk);
      data.append("district", doctorFormData.district);
      data.append("state", doctorFormData.state);
      data.append("country", doctorFormData.country);
      data.append("pin_code", doctorFormData.pin_code);
      data.append("specialization", doctorFormData.specialization);
      data.append("govt_id", doctorFormData.govt_id);
      data.append("approved", doctorFormData.approved ? "true" : "false");
      if (doctorFormData.govt_id_image) {
        data.append("govt_id_image", doctorFormData.govt_id_image);
      }

      if (editingDoctor) {
        // Update existing doctor
        await api.hospital_api.put(`/update/${editingDoctor._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Doctor updated successfully!");
      } else if (isAddingDoctorForHospitalId) {
        // Add new doctor
        data.append("user_password", doctorFormData.user_password);
        data.append("user_role", "doctor");
        data.append("hospital_id", doctorFormData.hospital_id);
        await api.admin_api.post("/auth/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Doctor registered successfully!");
      }

      setDoctorFormData({
        user_name: "",
        user_password: "",
        user_email: "",
        user_phone: "",
        city: "",
        taluk: "",
        district: "",
        state: "",
        country: "",
        pin_code: "",
        govt_id: "",
        govt_id_image: null,
        hospital_id: "",
        specialization: "",
        approved: false,
      });

      setEditingDoctor(null);
      setIsAddingDoctorForHospitalId(null);

      if (showDoctorTableId) {
        await fetchHospitalDoctors(showDoctorTableId);
      }
      if (showHospitalDoctorTableId) {
        await fetchDoctorsForHospital(showHospitalDoctorTableId);
      }
    } catch (error) {
      console.error("Error submitting doctor:", error);
      alert(editingDoctor ? "Update failed" : "Registration failed");
    }
  };

  const handleDeleteDoctor = async (doctorId: string, hospitalId: string) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await api.admin_api.delete(`/hospitals/delete-doctor/${doctorId}`);
      alert("Doctor deleted successfully");
      await fetchHospitalDoctors(hospitalId);
    } catch (err) {
      console.error("Error deleting doctor:", err);
      alert("Failed to delete doctor");
    }
  };

  const fetchDoctorsForHospital = async (hospitalId: string) => {
    try {
      console.log("Fetching doctors for hospital:", hospitalId);
      const res = await api.hospital_api.get<GetUsersResponse>(
        `/doctors/hospital/${hospitalId}`
      );
      console.log("API Response:", res.data);

      setDoctorsForHospital((prev) => {
        const newState = {
          ...prev,
          [hospitalId]: res.data.doctors || [], // Change 'users' to 'doctors'
        };
        console.log("Updated doctorsForHospital state:", newState);
        return newState;
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleToggleHospitalDoctors = async (hospitalId: string) => {
    if (showHospitalDoctorTableId === hospitalId) {
      setShowHospitalDoctorTableId(null);
    } else {
      setShowHospitalDoctorTableId(hospitalId);
      if (!doctorsForHospital[hospitalId]) {
        await fetchDoctorsForHospital(hospitalId);
      }
    }
  };

  useEffect(() => {
    // Fetch doctors when showDoctorTableId changes (organisation view)
    if (showDoctorTableId) {
      fetchHospitalDoctors(showDoctorTableId);
    }
  }, [showDoctorTableId]);

  useEffect(() => {
    // Fetch doctors when showHospitalDoctorTableId changes (hospital view)
    if (showHospitalDoctorTableId) {
      fetchDoctorsForHospital(showHospitalDoctorTableId);
    }
  }, [showHospitalDoctorTableId]);



  return (
    <div className="center-page">
      <div className="dashboard-header">
        <button className="burger-button" onClick={toggleMenu}>
          &#9776;
        </button>

        <div className="dropdown">
          <button
            className="role-button"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            {selectedRole === 'admin' ? "Home" : selectedRole} ▾
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-list">
              {roles.map((role) => (
                <li key={role} onClick={() => handleRoleChange(role)} className="role-list">
                  {role === "admin" ? (
                    <HomeIcon className="role-icon" />
                  ) : role === "doctor" ? (
                    <PersonIcon className="role-icon" />
                  ) : role === "hospital" ? (
                    <LocalHospitalIcon className="role-icon" />
                  ) : role === "pharmacy" ? (
                    <VaccinesIcon className="role-icon" />
                  ) : role === "lab" ? (
                    <BiotechIcon className="role-icon" />
                  ) : role === "organisation" ? (
                    <CorporateFareIcon className="role-icon" />
                  ) : role === "vendor" ? (
                    <StorefrontIcon className="role-icon" />
                  ) : role === "Animal Enthusiasts" ? (
                    <PersonIcon className="role-icon" />
                  ) : (
                    <PersonIcon className="role-icon" />
                  )}
                  &nbsp;
                  {role === "admin"
                    ? "Home"
                    : role.charAt(0).toUpperCase() + role.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="role-button" onClick={() => setActiveTab("orders")}>Appointments</button>
        <button className="role-button" onClick={() => setActiveTab("payments")}>Payments</button>
        <button className="role-button" onClick={() => setActiveTab("donar")}>Donar Request</button>
        

        


        {/* <div className={`role-list ${isMenuOpen ? "open" : ""}`}>
          {roles.map((role) => (
            <button
              key={role}
              className={`role-button ${selectedRole === role ? "active" : ""}`}
              onClick={() => {
                handleRoleSelect(role);
                setIsMenuOpen(false);
              }}
            >
              {role === "admin" ? (
                <HomeIcon className="role-icon" />
              ) : role === "doctor" ? (
                <PersonIcon className="role-icon" />
              ) : role === "hospital" ? (
                <LocalHospitalIcon className="role-icon" />
              ) : role === "pharmacy" ? (
                <VaccinesIcon className="role-icon" />
              ) : role === "lab" ? (
                <BiotechIcon className="role-icon" />
              ) : role === "organisation" ? (
                <CorporateFareIcon className="role-icon" />
              ) : role === "vendor" ? (
                <StorefrontIcon className="role-icon" />
              ) : role === "Animal Enthusiasts" ? (
                <PersonIcon className="role-icon" />
              ) : (
                <PersonIcon className="role-icon" />
              )}
              &nbsp;
              {role === "admin"
                ? "Home"
                : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div> */}

        <button
          className={`form-button1 ${isMenuOpen ? "lg-active" : ""}`}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>


      <div className="dashboard-container">
        <div className="dashboard-content">
          {activeTab === "users" ? (
            <>
              {selectedRole === "admin" && <h2>Admin Dashboard</h2>}
              {selectedRole === "admin" ? (
                <AdminInfo />
              ) : (
                <>
                  <div className="content-header">
                    <h2>
                      {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}'s List
                    </h2>
                    <button
                      className="form-button contact-button"
                      onClick={() => {
                        setShowAddModal(true);
                        newUserForm.role = selectedRole;
                      }}
                    >
                      Add New {selectedRole.toUpperCase()}
                    </button>

                  </div>
                  {loading ? (
                    <div className="loading">Loading...</div>
                  ) : (
                    <div className="table-container">
                      <AdminDataTable
                        users={users}
                        selectedRole={selectedRole}
                        organisationHospital={organisationHospital}
                        doctorsByHospital={doctorsByHospital}
                        doctorsForHospital={doctorsForHospital}
                        farmerAnimals={farmerAnimals}
                        expandedOrganisation={expandedOrganisation}
                        expandedFarmer={expandedFarmer}
                        showDoctorTableId={showDoctorTableId}
                        showHospitalDoctorTableId={showHospitalDoctorTableId}
                        editingAnimal={editingAnimal}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleExpandOrganisation={handleExpandOrganisation}
                        handleExpandFarmer={handleExpandFarmer}
                        handleToggleHospitalDoctors={handleToggleHospitalDoctors}
                        handleExpandDoctors={handleExpandDoctors}
                        handleDoctorEdit={handleDoctorEdit}
                        handleDeleteDoctor={handleDeleteDoctor}
                        setIsAddingHospital={setIsAddingHospital}
                        setEditingHospital={setEditingHospital}
                        setHospitalFormData={setHospitalFormData}
                        setDoctorFormData={setDoctorFormData}
                        setIsAddingDoctorForHospitalId={setIsAddingDoctorForHospitalId}
                        setEditingDoctor={setEditingDoctor}
                        setIsAddingAnimal={setIsAddingAnimal}
                        handleAnimalEdit={handleAnimalEdit}
                        handleAnimalDelete={handleAnimalDelete}
                        handleAnimalSubmit={handleAnimalSubmit}
                        resetAnimalForm={resetAnimalForm}
                        handleAnimalInputChange={handleAnimalInputChange}
                        animalFormData={animalFormData}
                        isAddingAnimal={isAddingAnimal}
                        handleDeleteHospital={handleDeleteHospital}
                        setAnimalFormData={setAnimalFormData}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          ) : activeTab === "orders" ? (
            <AppointmentSection />
          ) : activeTab === "payments" ? (
            <PaymentsSection />
          ) : activeTab === "donar" ? (
            <DonorRequestsSection /> 
          )  : null}
        </div>
      </div>

      {/* <div className="dashboard-container">
        <div className="dashboard-content">
          {selectedRole === "admin" && <h2>Admin Dashboard</h2>}
          {selectedRole === "admin" ? (
            ""
          ) : (
            <div className="content-header">
              <h2>
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}'s
                List
              </h2>
              <button
                className="form-button contact-button"
                onClick={() => {
                  setShowAddModal(true);
                  setNewUserForm((prev) => ({
                    ...prev,
                    role: selectedRole,
                    email: selectedRole === "farmer" ? "" : prev.email,
                  }));
                }}
              >
                Add New {selectedRole.toUpperCase()}
              </button>
            </div>
          )}
          {selectedRole === "admin" ? (
            <AdminInfo />
          ) : loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <AdminDataTable
                users={users}
                selectedRole={selectedRole}
                organisationHospital={organisationHospital}
                doctorsByHospital={doctorsByHospital}
                doctorsForHospital={doctorsForHospital}
                farmerAnimals={farmerAnimals}
                expandedOrganisation={expandedOrganisation}
                expandedFarmer={expandedFarmer}
                showDoctorTableId={showDoctorTableId}
                showHospitalDoctorTableId={showHospitalDoctorTableId}
                editingAnimal={editingAnimal}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleExpandOrganisation={handleExpandOrganisation}
                handleExpandFarmer={handleExpandFarmer}
                handleToggleHospitalDoctors={handleToggleHospitalDoctors}
                handleExpandDoctors={handleExpandDoctors}
                handleDoctorEdit={handleDoctorEdit}
                handleDeleteDoctor={handleDeleteDoctor}
                setIsAddingHospital={setIsAddingHospital}
                setEditingHospital={setEditingHospital}
                setHospitalFormData={setHospitalFormData}
                setDoctorFormData={setDoctorFormData}
                setIsAddingDoctorForHospitalId={setIsAddingDoctorForHospitalId}
                setEditingDoctor={setEditingDoctor}
                setIsAddingAnimal={setIsAddingAnimal}
                handleAnimalEdit={handleAnimalEdit}
                handleAnimalDelete={handleAnimalDelete}
                handleAnimalSubmit={handleAnimalSubmit}
                resetAnimalForm={resetAnimalForm}
                handleAnimalInputChange={handleAnimalInputChange}
                animalFormData={animalFormData}
                isAddingAnimal={isAddingAnimal}
                handleDeleteHospital={handleDeleteHospital}
                setAnimalFormData={setAnimalFormData}
              />
            </div>
          )}
        </div> */}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <input
                  className="form-input"
                  name="name"
                  value={newUserForm.name}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer" ? "Farmer Name" : "Name"
                  }
                  required
                />
              </div>
              {newUserForm.role !== "farmer" && (
                <div className="form-group">
                  <input
                    className="form-input"
                    name="email"
                    type="email"
                    value={newUserForm.email}
                    onChange={handleNewUserInputChange}
                    placeholder="Email"
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <input
                  className="form-input"
                  name="phone"
                  value={newUserForm.phone}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer" ? "Farmer Phone" : "Phone"
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="city"
                  value={newUserForm.city}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer"
                      ? "Farmer City / village"
                      : "City / village"
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="taluk"
                  value={newUserForm.taluk}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer" ? "Farmer Taluk" : "Taluk"
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="district"
                  value={newUserForm.district}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer"
                      ? "Farmer District"
                      : "District"
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="state"
                  value={newUserForm.state}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer" ? "Farmer State" : "State"
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="country"
                  value={newUserForm.country}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer"
                      ? "Farmer Country"
                      : "Country"
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="pin_code"
                  value={newUserForm.pin_code}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer"
                      ? "Farmer Pin code"
                      : "pin code"
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="password"
                  type="password"
                  value={newUserForm.password}
                  onChange={handleNewUserInputChange}
                  placeholder={
                    newUserForm.role === "farmer"
                      ? "Farmer Password"
                      : "Password"
                  }
                  required
                />
              </div>
              {newUserForm.role === "doctor" && (
                <>
                  <div className="form-group">
                    <input
                      className="form-input"
                      name="specialization"
                      value={newUserForm.specialization || ""}
                      onChange={handleNewUserInputChange}
                      placeholder="Specialization"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-input"
                      name="govt_id_number"
                      value={newUserForm.govt_id_number || ""}
                      onChange={handleNewUserInputChange}
                      placeholder="Govt ID Number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="file"
                      className="form-input"
                      accept="image/*"
                      onChange={(e) =>
                        setNewUserForm((prev) => ({
                          ...prev,
                          govt_id_image: e.target.files?.[0] || null,
                        }))
                      }
                      required
                    />
                  </div>
                </>
              )}
              {newUserForm.role === "lab" && (
                <div className="form-group">
                  <input
                    className="form-input"
                    name="gst_number"
                    value={newUserForm.gst_number || ""}
                    onChange={handleNewUserInputChange}
                    placeholder="GST Number"
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <select
                  className="form-select"
                  name="role"
                  value={selectedRole}
                  onChange={handleNewUserInputChange}
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit" className="form-button">
                  Add {newUserForm.role}
                </button>
                <button
                  type="button"
                  className="form-button cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  placeholder={
                    editFormData.role === "farmer" ? "Farmer Name" : "Name"
                  }
                />
              </div>
              {newUserForm.role !== "farmer" && (
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Email"
                  />
                </div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phone: e.target.value,
                    })
                  }
                  placeholder={
                    editFormData.role === "farmer" ? "Farmer Phone" : "Phone"
                  }
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={editFormData.city}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      city: e.target.value,
                    })
                  }
                  placeholder={
                    editFormData.role === "farmer"
                      ? "Farmer City/Village"
                      : "City/Village"
                  }
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="taluk"
                  className="form-input"
                  value={editFormData.taluk}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      taluk: e.target.value,
                    })
                  }
                  placeholder={
                    editFormData.role === "farmer" ? "Farmer Taluk" : "Taluk"
                  }
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="district"
                  className="form-input"
                  value={editFormData.district}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      district: e.target.value,
                    })
                  }
                  placeholder={
                    editFormData.role === "farmer"
                      ? "Farmer District"
                      : "District"
                  }
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  value={editFormData.state}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      state: e.target.value,
                    })
                  }
                  placeholder={
                    editFormData.role === "farmer" ? "Farmer State" : "State"
                  }
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="country"
                  className="form-input"
                  value={editFormData.country}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      country: e.target.value,
                    })
                  }
                  placeholder={
                    editFormData.role === "farmer"
                      ? "Farmer country"
                      : "Country"
                  }
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="pin_code"
                  className="form-input"
                  value={editFormData.pin_code}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      pin_code: e.target.value,
                    })
                  }
                  placeholder={
                    editFormData.role === "farmer"
                      ? "Farmer Pin code"
                      : "Pin code"
                  }
                />
              </div>
              {editFormData.role === "doctor" && (
                <>
                  <div className="form-group">
                    <input
                      className="form-input"
                      name="specialization"
                      value={editFormData.specialization || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          specialization: e.target.value,
                        }))
                      }
                      placeholder="Specialization"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-input"
                      name="govt_id_number"
                      value={editFormData.govt_id_number || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          govt_id_number: e.target.value,
                        }))
                      }
                      placeholder="Govt ID Number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="file"
                      className="form-input"
                      accept="image/*"
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          govt_id_image: e.target.files?.[0] || null,
                        }))
                      }
                      required
                    />
                  </div>
                </>
              )}
              {editFormData.role !== "farmer" && (
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editFormData.approved || false}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          approved: e.target.checked,
                        })
                      }
                    />{" "}
                    Approved
                  </label>
                </div>
              )}
              <div className="form-buttons">
                <button type="submit" className="form-button">
                  Update User
                </button>
                <button
                  type="button"
                  className="form-button cancel-button"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingHospital && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingHospital ? "Edit Hospital" : "Add New Hospital"}</h3>
            <form onSubmit={handleHospitalSubmit}>
              <div className="form-group">
                <input
                  className="form-input"
                  name="user_name"
                  value={hospitalFormData.user_name}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      user_name: e.target.value,
                    })
                  }
                  placeholder="Hospital Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="user_email"
                  value={hospitalFormData.user_email}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      user_email: e.target.value,
                    })
                  }
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="user_password"
                  type="password"
                  value={hospitalFormData.user_password}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      user_password: e.target.value,
                    })
                  }
                  placeholder="Password"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="user_phone"
                  value={hospitalFormData.user_phone}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      user_phone: e.target.value,
                    })
                  }
                  placeholder="Phone"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="city"
                  value={hospitalFormData.city}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      city: e.target.value,
                    })
                  }
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="taluk"
                  value={hospitalFormData.taluk}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      taluk: e.target.value,
                    })
                  }
                  placeholder="Taluk"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="district"
                  value={hospitalFormData.district}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      district: e.target.value,
                    })
                  }
                  placeholder="District"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="state"
                  value={hospitalFormData.state}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      state: e.target.value,
                    })
                  }
                  placeholder="State"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="country"
                  value={hospitalFormData.country}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      country: e.target.value,
                    })
                  }
                  placeholder="Country"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="pin_code"
                  value={hospitalFormData.pin_code}
                  onChange={(e) =>
                    setHospitalFormData({
                      ...hospitalFormData,
                      pin_code: e.target.value,
                    })
                  }
                  placeholder="Pin Code"
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={hospitalFormData.approved || false}
                    onChange={(e) =>
                      setHospitalFormData({
                        ...hospitalFormData,
                        approved: e.target.checked,
                      })
                    }
                  />{" "}
                  Approved
                </label>
              </div>
              <div className="form-buttons">
                <button type="submit" className="form-button">
                  {editingHospital ? "Update" : "Add"} Hospital
                </button>
                <button
                  type="button"
                  className="form-button cancel-button"
                  onClick={() => {
                    setIsAddingHospital(false);
                    setEditingHospital(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(isAddingDoctorForHospitalId || editingDoctor) && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* <h3>Add New Doctor</h3> */}
            <h3>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</h3>
            <form onSubmit={handleDoctorSubmit}>
              <div className="form-group">
                <input
                  className="form-input"
                  name="user_name"
                  value={doctorFormData.user_name}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      user_name: e.target.value,
                    })
                  }
                  placeholder="Doctor Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="user_email"
                  value={doctorFormData.user_email}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      user_email: e.target.value,
                    })
                  }
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="user_password"
                  type="password"
                  value={doctorFormData.user_password}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      user_password: e.target.value,
                    })
                  }
                  placeholder="Password"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="user_phone"
                  value={doctorFormData.user_phone}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      user_phone: e.target.value,
                    })
                  }
                  placeholder="Phone"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="specialization"
                  value={doctorFormData.specialization}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      specialization: e.target.value,
                    })
                  }
                  placeholder="Specialization"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="govt_id"
                  value={doctorFormData.govt_id}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      govt_id: e.target.value,
                    })
                  }
                  placeholder="Government ID"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      govt_id_image: e.target.files?.[0] || null,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="city"
                  value={doctorFormData.city}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      city: e.target.value,
                    })
                  }
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="taluk"
                  value={doctorFormData.taluk}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      taluk: e.target.value,
                    })
                  }
                  placeholder="Taluk"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="district"
                  value={doctorFormData.district}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      district: e.target.value,
                    })
                  }
                  placeholder="District"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="state"
                  value={doctorFormData.state}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      state: e.target.value,
                    })
                  }
                  placeholder="State"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="country"
                  value={doctorFormData.country}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      country: e.target.value,
                    })
                  }
                  placeholder="Country"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  name="pin_code"
                  value={doctorFormData.pin_code}
                  onChange={(e) =>
                    setDoctorFormData({
                      ...doctorFormData,
                      pin_code: e.target.value,
                    })
                  }
                  placeholder="Pin Code"
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={doctorFormData.approved || false}
                    onChange={(e) =>
                      setDoctorFormData({
                        ...doctorFormData,
                        approved: e.target.checked,
                      })
                    }
                  />{" "}
                  Approved
                </label>
              </div>
              <div className="form-buttons">
                <button type="submit" className="form-button">
                  {/* Add Doctor */}
                  {editingDoctor ? "Update" : "Add"} Doctor
                </button>
                <button
                  type="button"
                  className="form-button cancel-button"
                  onClick={() => {
                    setIsAddingDoctorForHospitalId(null);
                    setEditingDoctor(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};

export default AdminDashboard;
