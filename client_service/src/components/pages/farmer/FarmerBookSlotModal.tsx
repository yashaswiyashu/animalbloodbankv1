// import React, { useContext, useState, useEffect } from 'react';
// import api from '../../../api/axiosConfig';
// import { AuthContext } from '../../../context/AuthContext';

// interface Props {
//   doctorId: string;
//   slot: { start: Date; end: Date };
//   onClose: () => void;
//   onConfirm: (animal: Animal, aadhar: string) => void;
// }




// interface AnimalFormData {
//   type: string;
//   species: string;
//   breed: string;
//   age: string;
//   bloodGroup: string;
//   location: string;
// }

// interface Animal {
//   _id: string;
//   type: string;
//   species: string;
//   breed: string;
//   name: string;
//   age: number;
//   bloodGroup: string;
//   location: string;
//   praniAadharNumber: string;
//   farmerId: string;
// }

// interface GetAnimalsResponse {
//   message: string;
//   animals: Animal[];
// }

// const FarmerBookSlotModal: React.FC<Props> = ({ doctorId, slot, onClose, onConfirm }) => {
//   const context = useContext(AuthContext);
//   const FarmerId = context?.user?.id;

//   const [formData, setFormData] = useState<AnimalFormData>({
//     type: '',
//     species: '',
//     breed: '',
//     age: '',
//     bloodGroup: '',
//     location: '',
//   });

//   const [animals, setAnimals] = useState<Animal[]>([]);
//   const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
//   const [selectedAadhar, setSelectedAadhar] = useState<string>('');
//   const [addHealthRecord, setAddHealthRecord] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // Fetch all animals initially
//   useEffect(() => {
//     fetchAnimals();
//   }, []);


//   const fetchAnimals = async () => {
//     try {
//       const res = await api.farmer_api.get<GetAnimalsResponse>('/animal/get-animals');
//       setAnimals(res.data.animals);
//     } catch (error) {
//       console.error('Error fetching animals:', error);
//     }
//   };

//   // Update form values when animal selected
//   useEffect(() => {
//     if (selectedAnimal) {
//       setFormData({
//         type: selectedAnimal.type,
//         species: selectedAnimal.species,
//         breed: selectedAnimal.breed,
//         age: selectedAnimal.age.toString(),
//         bloodGroup: selectedAnimal.bloodGroup,
//         location: selectedAnimal.location,
//       });
//       setSelectedAadhar(selectedAnimal.praniAadharNumber);
//       setAddHealthRecord(false);
//     }
//   }, [selectedAnimal]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // const handleConfirm = async () => {
//   //   try {
//   //     if (!context || !context.user) {
//   //       alert('Farmer details not found.');
//   //       return;
//   //     }

//   //     const { farmer_name, farmer_phone } = context.user;

//   //     await api.farmer_api.post('/appointment/book', {
//   //       doctorId,
//   //       start_date: `${slot.start.getFullYear()}-${(slot.start.getMonth() + 1)
//   //         .toString()
//   //         .padStart(2, '0')}-${slot.start.getDate().toString().padStart(2, '0')}`,
//   //       start_time: `${slot.start.getHours().toString().padStart(2, '0')}:${slot.start
//   //         .getMinutes()
//   //         .toString()
//   //         .padStart(2, '0')}`,
//   //       end_date: `${slot.end.getFullYear()}-${(slot.end.getMonth() + 1)
//   //         .toString()
//   //         .padStart(2, '0')}-${slot.end.getDate().toString().padStart(2, '0')}`,
//   //       end_time: `${slot.end.getHours().toString().padStart(2, '0')}:${slot.end
//   //         .getMinutes()
//   //         .toString()
//   //         .padStart(2, '0')}`,
//   //       farmerName: farmer_name,
//   //       farmerContact: farmer_phone,
//   //       type: formData.type,
//   //       species: formData.species,
//   //       praniAadharNumber: selectedAadhar,
//   //       farmer_id: FarmerId,
//   //       razorpay_payment_id: paymentId,
//   //       healthRecord: addHealthRecord ? 'yes' : 'no',
//   //     });

//   //     alert('Appointment booked!');
//   //     onSuccess();
//   //     onClose();
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert('Booking failed');
//   //   }
//   // };


//   const handleConfirm = () => {
//   if (!selectedAnimal || !selectedAadhar) {
//     alert('Please select an animal');
//     return;
//   }
//   onConfirm(selectedAnimal, selectedAadhar);
// };





//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <h3>Confirm Booking</h3>
//         <p>
//           From: {slot.start.toLocaleString()}<br />
//           To: {slot.end.toLocaleString()}
//         </p>

//         {/* Custom Dropdown for Animal Selection */}
//         <div className="form-field">
//           <label>Select Animal</label>
//           <div className="custom-dropdown">
//             <div
//               className="dropdown-header"
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
//             >
//               {selectedAnimal ? (
//                 <strong>
//                 {selectedAnimal.species}   —  {selectedAnimal.name}
//                   {/* {selectedAnimal.name} — {selectedAnimal.type}, {selectedAnimal.species} */}
//                 </strong>
//               ) : (
//                 <span>Select an Animal</span>
//               )}
//             </div>

//             {dropdownOpen && (
//               <div
//                 className="dropdown-menu"
//                 style={{
//                   border: '1px solid #ccc',
//                   maxHeight: 250,
//                   overflowY: 'auto',
//                   backgroundColor: '#fff',
//                   position: 'absolute',
//                   zIndex: 1000,
//                   width: '100%',
//                   borderRadius: '5px',
//                   marginTop: '5px',
//                 }}
//               >
//                 {animals.map((animal) => (
//                   <div
//                     key={animal._id}
//                     onClick={() => {
//                       setSelectedAnimal(animal);
//                       setDropdownOpen(false);
//                     }}
//                     style={{
//                       padding: '10px',
//                       borderBottom: '1px solid #eee',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     <p><strong>{animal.name}</strong></p>
//                     <p>Type: {animal.type}</p>
//                     <p>Species: {animal.species}</p>
//                     <p>Aadhar: {animal.praniAadharNumber}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Individual Fields after card selection */}
//         <div className="form-field">
//           <label>Type</label>
//           <select
//             className="form-select"
//             name="type"
//             value={formData.type}
//             onChange={handleInputChange}
//             required
//             disabled
//           >
//             <option value="" disabled>Select type</option>
//             <option value="Vet">Vet</option>
//             <option value="Pet">Pet</option>
//           </select>
//         </div>

//         {formData.type && (
//           <div className="form-field">
//             <label>Species</label>
//             <select
//               className="form-select"
//               name="species"
//               value={formData.species}
//               onChange={handleInputChange}
//               required
//               disabled
//             >
//               <option value={formData.species}>{formData.species}</option>
//             </select>
//           </div>
//         )}

//         {formData.species && selectedAnimal && (
//           <div className="form-field">
//             <label>Animal</label>
//             <select className="form-select" value={selectedAnimal.name} disabled>
//               <option>{selectedAnimal.name}</option>
//             </select>
//           </div>
//         )}

//         {selectedAadhar && (
//           <div className="form-field">
//             <label>Selected Aadhar</label>
//             <input
//               type="text"
//               value={selectedAadhar}
//               readOnly
//               className="form-input"
//             />
//           </div>
//         )}

//         {selectedAadhar && (
//           <div className="form-field" style={{ marginTop: '20px' }}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={addHealthRecord}
//                 onChange={() => setAddHealthRecord(!addHealthRecord)}
//               />
//               Add Previous Health Record
//             </label>
//           </div>
//         )}

//         <br />
//         <div className="form-buttons">
//           <button onClick={handleConfirm} className="form-button">Book</button>
//           <button onClick={onClose} className="form-button">Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FarmerBookSlotModal;






import React, { useEffect, useState } from 'react';


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
  animalImage: File | null;
}


interface Props {
  doctorId: string;
  slot: { start: Date; end: Date };
  selectedAnimal: Animal;
  onClose: () => void;
  onConfirm: (animal: Animal, aadhar: string, healthRecord: 'yes' | 'no') => void;
}

const FarmerBookSlotModal: React.FC<Props> = ({
  doctorId,
  slot,
  selectedAnimal,
  onClose,
  onConfirm,
}) => {
  const [formData, setFormData] = useState({
    type: '',
    species: '',
    breed: '',
    age: '',
    bloodGroup: '',
    location: '',
  });

  const [selectedAadhar, setSelectedAadhar] = useState<string>('');
  const [addHealthRecord, setAddHealthRecord] = useState(false);

  useEffect(() => {
    if (selectedAnimal) {
      setFormData({
        type: selectedAnimal.type,
        species: selectedAnimal.species,
        breed: selectedAnimal.breed,
        age: selectedAnimal.age.toString(),
        bloodGroup: selectedAnimal.bloodGroup,
        location: `${selectedAnimal.city}, ${selectedAnimal.taluk}, ${selectedAnimal.district}, ${selectedAnimal.state}, ${selectedAnimal.country}`,
      });
      setSelectedAadhar(selectedAnimal.praniAadharNumber);
    }
  }, [selectedAnimal]);

  const handleConfirm = () => {
    if (!selectedAnimal || !selectedAadhar) {
      alert('Animal information missing.');
      return;
    }
    onConfirm(selectedAnimal, selectedAadhar, addHealthRecord ? 'yes' : 'no');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="form-container">
          <form>
          <h2>Confirm Booking</h2>
          
          <p>
            From: {slot.start.toLocaleString()}<br />
            To: {slot.end.toLocaleString()}
          </p>

        {/* <div className="form-field">
          <label>Type</label>
          <input type="text" value={formData.type} readOnly className="form-input" />
        </div> */}

        <div className="form-field">
          <label>Animal</label>
          <input type="text" value={formData.species} readOnly className="form-input" />
        </div>

        <div className="form-field">
          <label>Breed</label>
          <input type="text" value={formData.breed} readOnly className="form-input" />
        </div>

        <div className="form-field">
          <label>Name</label>
          <input type="text" value={selectedAnimal.name} readOnly className="form-input" />
        </div>

        <div className="form-field">
          <label>Age</label>
          <input type="text" value={formData.age} readOnly className="form-input" />
        </div>

        <div className="form-field">
          <label>Animal Image</label>
          {selectedAnimal.animalImage ? (
            <img
              src={`${process.env.REACT_APP_MEDIA_URL}${selectedAnimal.animalImage}`}
              alt={selectedAnimal.name}
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '50%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                marginTop: '8px'
              }}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>


        {/* <div className="form-field">
          <label>Blood Group</label>
          <input type="text" value={formData.bloodGroup} readOnly className="form-input" />
        </div> */}

        {/* <div className="form-field">
          <label>Prani Aadhar Number</label>
          <input type="text" value={selectedAadhar} readOnly className="form-input" />
        </div> */}

          <div className="form-field checkbox-field" style={{ marginTop: '20px' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={addHealthRecord}
                onChange={() => setAddHealthRecord(!addHealthRecord)}
              />
              Add Previous Health Record
            </label>
          </div>

          <br />
          <div className="form-buttons">
            <button onClick={handleConfirm} className="form-button">Proceed to Payment</button>
            <button onClick={onClose} className="form-button">Cancel</button>
            
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerBookSlotModal;

