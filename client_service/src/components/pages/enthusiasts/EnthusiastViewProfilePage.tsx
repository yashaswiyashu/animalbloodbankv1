import React, { useEffect, useState } from 'react';
import { useParams, Link , useLocation} from 'react-router-dom';
import api from '../../../api/axiosConfig';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../../../styles/forms.css';
import '../../../styles/dashboard.css';

interface Message {
  _id: string;
  content: string;
  createdAt: string;
}

interface ImageType {
  _id: string;
  imageUrl: string;
}

const ProfilePage: React.FC = () => {
  const { type, id } = useParams<{ type: 'organisation' | 'hospital'; id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

const location = useLocation();
const { name } = location.state || {};

  useEffect(() => {
    if (!type || !id) return;

    const fetchData = async () => {
      try {
        if (type === 'organisation') {
          const msgRes = await api.organization_api.get<Message[]>('/description', {
            params: { organisation_id: id },
          });
          const imgRes = await api.organization_api.get<ImageType[]>('/images', {
            params: { organisation_id: id },
          });
          setMessages(msgRes.data);
          setImages(imgRes.data);
        } else if (type === 'hospital') {
          const msgRes = await api.hospital_api.get<Message[]>('/hospital', {
            params: { organisation_id: id }, // you used organisation_id here
          });
          const imgRes = await api.hospital_api.get<ImageType[]>('/hospital/images', {
            params: { hospital_id: id },
          });
          setMessages(msgRes.data);
          setImages(imgRes.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (loading) return <div className="center-page">Loading...</div>;

  return (
    <div className="center-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Link className="back-button" to="/enthusiasts"><ArrowBackIcon /></Link>
          <h2>{type === 'hospital' ? 'Hospital' : 'Organisation'} Profile</h2>
        </div>
        

        <div className="dashboard-content">
        <h2 style={{ textAlign: 'center' }}>{name}'s Profile</h2>
          <h3 className='enthusiast-h3'>About {type}</h3>
          {messages.length === 0 ? (
            <p className='enthusiast-h3'>No description available.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className="message-box">
                <p>{msg.content}</p>
                <small>{new Date(msg.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}

          <h3 className='enthusiast-h3' style={{ marginTop: '30px' }}>Gallery</h3>
          {images.length === 0 ? (
            <p className='enthusiast-h3'>No images uploaded.</p>
          ) : (
            <div className="gallery-container">
              {images.map((img) => (
                <div className="image-item" key={img._id}>
                  <img
                    // src={`http://${img.imageUrl}`}
                    src={`${process.env.REACT_APP_MEDIA_URL}${img.imageUrl}`}
                    alt="Uploaded"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
