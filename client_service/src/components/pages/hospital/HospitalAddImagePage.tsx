import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../api/axiosConfig';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../../../styles/forms.css';
import '../../../styles/dashboard.css';

interface ImageType {
  _id: string;
  imageUrl: string;
}

interface UploadResponse {
  message: string;
  images: ImageType[];
}

const HospitalAddImg: React.FC = () => {
const [images, setImages] = useState<ImageType[]>([]);


const fetchImages = async () => {
const res = await api.hospital_api.get<ImageType[]>(`/hospital/images?hospital_id=${hospitalId}`);
setImages(res.data);
};


  useEffect(() => {
    fetchImages();
  }, []);

  const context = useContext(AuthContext);
  const hospitalId = context?.user?.id;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
      formData.append("hospital_id", hospitalId);

      const res = await api.hospital_api.post("/hospital/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages((prev) => [...prev, ...(res as any).data.images]);
    }
  };

  const deleteImage = async (id: string) => {
    await api.hospital_api.delete(`/hospital/image/${id}`);
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  return (
    <div className="center-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Link className="back-button" to="/hospital"><ArrowBackIcon /></Link>
        
          <h2>Images Gallary</h2>
        </div>
        <div className="dashboard-content">
        <h2>Add Hospital Images Here</h2>
        <div className="gallery-container">
      <div className="image-item add-image">
        <label className="upload-label">
          <img 
          src="https://static.thenounproject.com/png/4059754-200.png" 
          alt="Upload"
          style={{ width: '100px', height: '50px%', objectFit: 'contain' }}
        />
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden-input"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {images.map((img) => (
        <div className="image-item" key={img._id}>
          {/* <img src={img.imageUrl} alt="uploaded" className="image" /> */}
          <img 
          src={`${process.env.REACT_APP_MEDIA_URL}${img.imageUrl}`}
          style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "6px",
        }}
          />
          <button className="img-delete-btn" onClick={() => deleteImage(img._id)}>×</button>
        </div>
        
      ))}
    </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalAddImg;
