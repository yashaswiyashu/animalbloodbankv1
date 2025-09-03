import React from 'react'

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

interface Props {
  users: User[];
  selectedRole: string;
  organisationHospital: Record<string, User[]>;
  doctorsByHospital: Record<string, User[]>;
  doctorsForHospital: Record<string, User[]>;
  farmerAnimals: Record<string, Animal[]>;
  expandedOrganisation: string | null;
  expandedFarmer: string | null;
  showDoctorTableId: string | null;
  showHospitalDoctorTableId: string | null;
  editingAnimal: Animal | null;

  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
  handleExpandOrganisation: (id: string) => void;
  handleExpandFarmer: (id: string) => void;
  handleToggleHospitalDoctors: (id: string) => void;
  handleExpandDoctors: (id: string) => void;
  handleDoctorEdit: (user: User) => void;
  handleDeleteDoctor: (id: string, hospitalId: string) => void;
  setIsAddingHospital: (state: boolean) => void;
  setEditingHospital: (user: User | null) => void;
  setHospitalFormData: (data: any) => void;
  setDoctorFormData: (data: any) => void;
  setIsAddingDoctorForHospitalId: (id: string | null) => void;
  setEditingDoctor: (user: User | null) => void;
  setIsAddingAnimal: (state: boolean) => void;
  handleAnimalEdit: (animal: Animal) => void;
  handleAnimalDelete: (animalId: string, farmerId: string) => void;
  handleAnimalSubmit: (e: React.FormEvent, farmerId: string) => void;
  resetAnimalForm: () => void;
  handleAnimalInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  animalFormData: any;
  isAddingAnimal: boolean;
  handleDeleteHospital: (hospitalId: string) => void;
  setAnimalFormData: (data: any) => void;
}

const AdminDataTable: React.FC<Props> = ({
    users,
    selectedRole,
    organisationHospital,
    doctorsByHospital,
    doctorsForHospital,
    farmerAnimals,
    expandedOrganisation,
    expandedFarmer,
    showDoctorTableId,
    showHospitalDoctorTableId,
    editingAnimal,
    handleEdit,
    handleDelete,
    handleExpandOrganisation,
    handleExpandFarmer,
    handleToggleHospitalDoctors,
    handleExpandDoctors,
    handleDoctorEdit,
    handleDeleteDoctor,
    setIsAddingHospital,
    setEditingHospital,
    setHospitalFormData,
    setDoctorFormData,
    setIsAddingDoctorForHospitalId,
    setEditingDoctor,
    setIsAddingAnimal,
    handleAnimalEdit,
    handleAnimalDelete,
    handleAnimalSubmit,
    resetAnimalForm,
    handleAnimalInputChange,
    animalFormData,
    isAddingAnimal,
    handleDeleteHospital,
    setAnimalFormData
}) => {
  return (
    <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    {selectedRole !== "farmer" && <th>Email</th>}
                    <th>Phone</th>
                    <th>Address</th>
                    {selectedRole === "doctor" && <th>ID Image</th>}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <React.Fragment key={user._id}>
                      <tr>
                        <td>{user.user_name || user.farmer_name}</td>
                        {selectedRole !== "farmer" && (
                          <td>{user.user_email}</td>
                        )}
                        <td>{user.user_phone || user.farmer_phone}</td>
                        <td>
                          {user.city || user.farmer_city} ,
                          {user.taluk || user.farmer_taluk},{" "}
                          {user.district || user.farmer_district},<br />{" "}
                          {user.state || user.farmer_state},{" "}
                          {user.country || user.farmer_country} -{" "}
                          {user.pin_code || user.farmer_pin_code}
                        </td>
                        {selectedRole === "doctor" && (
                          <td>
                            {user.govt_id_image ? (
                              <img
                                src={`${process.env.REACT_APP_MEDIA_URL}${user.govt_id_image}`}
                                alt="ID"
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                            ) : (
                              <span>No Image</span>
                            )}
                          </td>
                        )}
                        <td>
                          {selectedRole === "farmer" && (
                            <button
                              className="action-button view"
                              onClick={() => handleExpandFarmer(user._id)}
                            >
                              {expandedFarmer === user._id
                                ? "Hide Animals"
                                : "View Animals"}
                            </button>
                          )}

                          {selectedRole === "organisation" && (
                            <button
                              className="action-button view"
                              onClick={() => handleExpandOrganisation(user._id)}
                            >
                              {expandedOrganisation === user._id
                                ? "Hide Hospitals"
                                : "View Hospitals"}
                            </button>
                          )}

                          {selectedRole === "hospital" && (
                            <button
                              className="action-button view"
                              onClick={() =>
                                handleToggleHospitalDoctors(user._id)
                              }
                            >
                              {showHospitalDoctorTableId === user._id
                                ? "Hide Doctors"
                                : "View Doctors"}
                            </button>
                          )}

                          <button
                            className="action-button edit"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-button delete"
                            onClick={() => handleDelete(user)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {selectedRole === "organisation" &&
                        expandedOrganisation === user._id && (
                          <tr>
                            <td
                              colSpan={selectedRole === "organisation" ? 6 : 5}
                              className="expanded-content"
                            >
                              <div className="animals-section">
                                <div className="animals-header">
                                  <h4>Hospitals</h4>
                                  <button
                                    className="action-button add"
                                    onClick={() => {
                                      setHospitalFormData({
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
                                        organisation_id: user._id,
                                        approved: false,
                                      });
                                      setIsAddingHospital(true);
                                    }}
                                  >
                                    Add New Hospital
                                  </button>
                                </div>

                                <div className="table-container">
                                  <table className="data-table">
                                    <thead>
                                      <tr>
                                        <th>Hospital Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {organisationHospital[user._id]?.map(
                                        (hospital) => (
                                          <React.Fragment key={hospital._id}>
                                            <tr>
                                              <td>{hospital.user_name}</td>
                                              <td>{hospital.user_email}</td>
                                              <td>{hospital.user_phone}</td>
                                              <td>
                                                {hospital.city},{" "}
                                                {hospital.taluk},{" "}
                                                {hospital.district}, <br />
                                                {hospital.state},{" "}
                                                {hospital.country} -{" "}
                                                {hospital.pin_code}
                                              </td>
                                              <td>
                                                <button
                                                  className="action-button view"
                                                  onClick={() =>
                                                    handleExpandDoctors(
                                                      hospital._id
                                                    )
                                                  }
                                                >
                                                  {showDoctorTableId ===
                                                  hospital._id
                                                    ? "Hide Doctors"
                                                    : "View Doctors"}
                                                </button>
                                                <button
                                                  className="action-button edit"
                                                  onClick={() => {
                                                    setEditingHospital(
                                                      hospital
                                                    );
                                                    setHospitalFormData({
                                                      user_name:
                                                        hospital.user_name ||
                                                        "",
                                                      user_password: "",
                                                      user_phone:
                                                        hospital.user_phone ||
                                                        "",
                                                      user_email:
                                                        hospital.user_email ||
                                                        "",
                                                      city: hospital.city || "",
                                                      taluk:
                                                        hospital.taluk || "",
                                                      district:
                                                        hospital.district || "",
                                                      state:
                                                        hospital.state || "",
                                                      country:
                                                        hospital.country || "",
                                                      pin_code:
                                                        hospital.pin_code || "",
                                                      organisation_id:
                                                        hospital.organisation_id ||
                                                        "",
                                                      approved:
                                                        hospital.approved ||
                                                        false,
                                                    });
                                                    setIsAddingHospital(true);
                                                  }}
                                                >
                                                  Edit
                                                </button>
                                                <button
                                                  className="action-button delete"
                                                  onClick={() =>
                                                    handleDeleteHospital(
                                                      hospital._id
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </button>
                                              </td>
                                            </tr>

                                            {showDoctorTableId ===
                                              hospital._id && (
                                              <tr>
                                                <td colSpan={5}>
                                                  <div className="sub-table-container">
                                                    <div className="animals-header">
                                                      <h4>Doctors</h4>
                                                      <button
                                                        className="action-button add"
                                                        onClick={() => {
                                                          setDoctorFormData(
                                                            (prev: any) => ({
                                                              ...prev,
                                                              hospital_id:
                                                                hospital._id,
                                                            })
                                                          );
                                                          setIsAddingDoctorForHospitalId(
                                                            hospital._id
                                                          );
                                                          setEditingDoctor(
                                                            null
                                                          );
                                                        }}
                                                      >
                                                        Add New Doctor
                                                      </button>
                                                    </div>
                                                    <table className="data-table">
                                                      <thead>
                                                        <tr>
                                                          <th>Doctor Name</th>
                                                          <th>Email</th>
                                                          <th>Phone</th>
                                                          <th>
                                                            Specialization
                                                          </th>
                                                          <th>Address</th>
                                                          <th>Government ID</th>
                                                          <th>Actions</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {doctorsByHospital[
                                                          hospital._id
                                                        ]?.map((doctor) => (
                                                          <tr key={doctor._id}>
                                                            <td>
                                                              {doctor.user_name}
                                                            </td>
                                                            <td>
                                                              {
                                                                doctor.user_email
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                doctor.user_phone
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                doctor.specialization
                                                              }
                                                            </td>
                                                            <td>
                                                              {doctor.city},{" "}
                                                              {doctor.taluk},{" "}
                                                              {doctor.district},{" "}
                                                              <br />
                                                              {
                                                                doctor.state
                                                              },{" "}
                                                              {doctor.country} -{" "}
                                                              {doctor.pin_code}
                                                            </td>
                                                            <td>
                                                              {doctor.govt_id_image && (
                                                                <img
                                                                  src={`${process.env.REACT_APP_MEDIA_URL}/auth${doctor.govt_id_image}`}
                                                                  alt="Government ID"
                                                                  style={{
                                                                    width:
                                                                      "100px",
                                                                    height:
                                                                      "50px",
                                                                    objectFit:
                                                                      "cover",
                                                                  }}
                                                                />
                                                              )}
                                                            </td>
                                                            <td>
                                                              <button
                                                                className="action-button edit"
                                                                onClick={() => {
                                                                  handleDoctorEdit(
                                                                    doctor
                                                                  );
                                                                  setIsAddingDoctorForHospitalId(
                                                                    hospital._id
                                                                  );
                                                                  // fetchHospitalDoctors(hospital._id);
                                                                }}
                                                              >
                                                                Edit
                                                              </button>
                                                              <button
                                                                className="action-button delete"
                                                                onClick={() =>
                                                                  handleDeleteDoctor(
                                                                    doctor._id,
                                                                    hospital._id
                                                                  )
                                                                }
                                                              >
                                                                Delete
                                                              </button>
                                                            </td>
                                                          </tr>
                                                        ))}
                                                        {(!doctorsByHospital[
                                                          hospital._id
                                                        ] ||
                                                          doctorsByHospital[
                                                            hospital._id
                                                          ].length === 0) && (
                                                          <tr>
                                                            <td
                                                              colSpan={7}
                                                              className="no-data"
                                                            >
                                                              No doctors found
                                                            </td>
                                                          </tr>
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                </td>
                                              </tr>
                                            )}
                                          </React.Fragment>
                                        )
                                      )}
                                      {(!organisationHospital[user._id] ||
                                        organisationHospital[user._id]
                                          .length === 0) && (
                                        <tr>
                                          <td colSpan={5} className="no-data">
                                            No hospitals found
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                      {selectedRole === "hospital" &&
                        showHospitalDoctorTableId === user._id && (
                          <tr>
                            <td colSpan={6} className="expanded-content">
                              <div className="sub-table-container">
                                <div className="animals-header">
                                  <h4>Doctors</h4>
                                  <button
                                    className="action-button add"
                                    onClick={() => {
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
                                        hospital_id: user._id,
                                        specialization: "",
                                        approved: false,
                                      });
                                      setIsAddingDoctorForHospitalId(user._id);
                                      setEditingDoctor(null);
                                    }}
                                  >
                                    Add New Doctor
                                  </button>
                                </div>
                                <table className="data-table">
                                  <thead>
                                    <tr>
                                      <th>Doctor Name</th>
                                      <th>Email</th>
                                      <th>Phone</th>
                                      <th>Specialization</th>
                                      <th>Address</th>
                                      <th>Govt Id</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {doctorsForHospital[user._id]?.map(
                                      (doctor) => (
                                        <tr key={doctor._id}>
                                          <td>{doctor.user_name}</td>
                                          <td>{doctor.user_email}</td>
                                          <td>{doctor.user_phone}</td>
                                          <td>{doctor.specialization}</td>
                                          <td>
                                            {doctor.city}, {doctor.taluk},{" "}
                                            {doctor.district}, <br />
                                            {doctor.state}, {doctor.country} -{" "}
                                            {doctor.pin_code}
                                          </td>
                                          <td>
                                            {doctor.govt_id_image && (
                                              <img
                                                src={`${process.env.REACT_APP_MEDIA_URL}/auth${doctor.govt_id_image}`}
                                                alt="Government ID"
                                                style={{
                                                  width: "100px",
                                                  height: "50px",
                                                  objectFit: "cover",
                                                }}
                                              />
                                            )}
                                          </td>
                                          <td>
                                            <button
                                              className="action-button edit"
                                              onClick={() => {
                                                handleDoctorEdit(doctor);
                                                setIsAddingDoctorForHospitalId(
                                                  user._id
                                                );
                                                // fetchDoctorsForHospital(user._id);
                                              }}
                                            >
                                              Edit
                                            </button>
                                            <button
                                              className="action-button delete"
                                              onClick={() =>
                                                handleDeleteDoctor(
                                                  doctor._id,
                                                  user._id
                                                )
                                              }
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                    {(!doctorsForHospital[user._id] ||
                                      doctorsForHospital[user._id].length ===
                                        0) && (
                                      <tr>
                                        <td colSpan={7} className="no-data">
                                          No doctors found
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}

                      {selectedRole === "farmer" &&
                        expandedFarmer === user._id && (
                          <tr>
                            <td
                              colSpan={selectedRole === "farmer" ? 6 : 5}
                              className="expanded-content"
                            >
                              <div className="animals-section">
                                <div className="animals-header">
                                  <h4>Animals</h4>
                                  <button
                                    className="action-button add"
                                    onClick={() => setIsAddingAnimal(true)}
                                  >
                                    Add New Animal
                                  </button>
                                </div>

                                {(isAddingAnimal || editingAnimal) && (
                                  <div className="modal-overlay">
                                    <div className="modal-content">
                                      <h4>
                                        {editingAnimal
                                          ? "Edit Animal"
                                          : "Add New Animal"}
                                      </h4>
                                      <form
                                        onSubmit={(e) =>
                                          handleAnimalSubmit(e, user._id)
                                        }
                                      >
                                        <div className="form-group">
                                          <select
                                            name="type"
                                            value={animalFormData.type}
                                            onChange={handleAnimalInputChange}
                                            required
                                            style={{
                                              width: "100%",
                                              height: "4rem",
                                              padding: "1rem",
                                              borderRadius: "18px",
                                              fontSize: "16px",
                                              backgroundColor: "#f9f9f9",
                                              color: "#222",
                                            }}
                                          >
                                            <option value="" disabled>
                                              Select type
                                            </option>
                                            <option value="Vet">Vet</option>
                                            <option value="Pet">Pet</option>
                                          </select>
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="species"
                                            value={animalFormData.species}
                                            onChange={handleAnimalInputChange}
                                            placeholder="Species"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="breed"
                                            value={animalFormData.breed}
                                            onChange={handleAnimalInputChange}
                                            placeholder="Breed"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="name"
                                            value={animalFormData.name}
                                            onChange={handleAnimalInputChange}
                                            placeholder="Name"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="age"
                                            type="number"
                                            value={animalFormData.age}
                                            onChange={handleAnimalInputChange}
                                            placeholder="Age"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="bloodGroup"
                                            value={animalFormData.bloodGroup}
                                            onChange={handleAnimalInputChange}
                                            placeholder="Blood Group"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="city"
                                            value={animalFormData.city}
                                            onChange={handleAnimalInputChange}
                                            placeholder="City/Village"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="taluk"
                                            value={animalFormData.taluk}
                                            onChange={handleAnimalInputChange}
                                            placeholder="Taluk"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="district"
                                            value={animalFormData.district}
                                            onChange={handleAnimalInputChange}
                                            placeholder="District"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="state"
                                            value={animalFormData.state}
                                            onChange={handleAnimalInputChange}
                                            placeholder="State"
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <input
                                            className="form-input"
                                            name="country"
                                            value={animalFormData.country}
                                            onChange={(e) =>
                                              setAnimalFormData({
                                                ...animalFormData,
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
                                            value={animalFormData.pin_code}
                                            onChange={handleAnimalInputChange}
                                            placeholder="Pin code"
                                            required
                                          />
                                        </div>
                                        <div className="form-buttons">
                                          <button
                                            type="submit"
                                            className="form-button"
                                          >
                                            {editingAnimal ? "Update" : "Add"}{" "}
                                            Animal
                                          </button>
                                          <button
                                            type="button"
                                            className="form-button cancel-button"
                                            onClick={resetAnimalForm}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                )}

                                <div className="table-container">
                                  <table className="data-table">
                                    <thead>
                                      <tr>
                                        <th>Prani Aadhar</th>
                                        <th>Type</th>
                                        <th>Species</th>
                                        <th>Breed</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Blood Group</th>
                                        <th>Location</th>
                                        <th>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {farmerAnimals[user._id]?.map(
                                        (animal) => (
                                          <tr key={animal._id}>
                                            <td>{animal.praniAadharNumber}</td>
                                            <td>{animal.type}</td>
                                            <td>{animal.species}</td>
                                            <td>{animal.breed}</td>
                                            <td>{animal.name}</td>
                                            <td>{animal.age}</td>
                                            <td>{animal.bloodGroup}</td>
                                            <td>
                                              {animal.city}, {animal.taluk},{" "}
                                              {animal.district}, <br />{" "}
                                              {animal.state}, {animal.country} -{" "}
                                              {animal.pin_code}
                                            </td>
                                            <td>
                                              <button
                                                className="action-button edit"
                                                onClick={() =>
                                                  handleAnimalEdit(animal)
                                                }
                                              >
                                                Edit
                                              </button>
                                              <button
                                                className="action-button delete"
                                                onClick={() =>
                                                  handleAnimalDelete(
                                                    animal._id,
                                                    user._id
                                                  )
                                                }
                                              >
                                                Delete
                                              </button>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                      {(!farmerAnimals[user._id] ||
                                        farmerAnimals[user._id].length ===
                                          0) && (
                                        <tr>
                                          <td colSpan={9} className="no-data">
                                            No animals found
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={selectedRole === "farmer" ? 4 : 5}
                        className="no-data"
                      >
                        No users found for this role
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
  )
}

export default AdminDataTable