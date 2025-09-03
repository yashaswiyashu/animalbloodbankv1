import React, { useState, useEffect, useContext } from 'react';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../../../styles/forms.css';
import '../../../styles/dashboard.css';

interface Message {
    _id: string;
    content: string;
}

const HospitalAddDesc: React.FC = () => {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [editId, setEditId] = useState<string | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);


    // const fetchMessages = async () => {
    //     const res = await api.get<Message[]>('/hospital');
    //     setMessages(res.data);
    // };

    const fetchMessages = async () => {
        if (!organisationId) return;
        const res = await api.hospital_api.get<Message[]>(`/hospital?organisation_id=${organisationId}`);
        setMessages(res.data);
    };


    useEffect(() => {
        fetchMessages();
    }, []);

    const context = useContext(AuthContext);
    const organisationId = context?.user?.id;

    const handleSubmit = async () => {
        if (!text.trim()) return;

        if (editId) {
            const res = await api.hospital_api.put<Message>(`/hospital/${editId}`, { content: text, organisation_id: organisationId });
            setMessages(messages.map((m) => (m._id === editId ? res.data : m)));
            setEditId(null);
        } else {
            const res = await api.hospital_api.post<Message>('/hospital', {
                content: text,
                organisation_id: organisationId,
            });
            setMessages([res.data, ...messages]);
        }

        setText('');
    };

    // const handleDelete = async (id: string) => {
    // const confirmDelete = window.confirm('Are you sure you want to delete this message?');
    // if (!confirmDelete) return;

    // try {
    // await api.hospital_api.delete(`/hospital/${id}`);
    // setMessages(messages.filter((msg) => msg._id !== id));
    // } catch (error) {
    // console.error('Error deleting message:', error);
    // }
    // };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setShowConfirmModal(true);
    };


    const handleEdit = (message: Message) => {
        setEditId(message._id);
        setText(message.content);
    };



    return (
        <div className="center-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                <Link className="back-button" to="/hospital"><ArrowBackIcon /></Link>
                    <h2>Description Box</h2>
                </div>
                <div className="dashboard-content">
                    
                    <h2>About Hospital</h2>

                    <div className="text-message-container">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={6}
                            placeholder="Type your message..."
                            className="text-message-textarea"
                        />
                        <button
                            onClick={handleSubmit}
                            className="text-message-submit"
                        >
                            {editId ? 'Update' : 'Submit'}
                        </button>

                        <div className="text-message-list">
                            {messages.map((msg) => (
                                <div key={msg._id} className="text-message-item">
                                    <p>{msg.content}</p>
                                    <div className="text-message-actions">
                                        <button onClick={() => handleEdit(msg)}>Edit</button>
                                        <button onClick={() => handleDelete(msg._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showConfirmModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Confirm Deletion</h3>
                                <p>Are you sure you want to delete this message?</p>
                                <div className="form-buttons">
                                    <button
                                        onClick={async () => {
                                            if (deleteId) {
                                                try {
                                                    await api.hospital_api.delete(`/hospital/${deleteId}`);
                                                    setMessages((prev) => prev.filter((msg) => msg._id !== deleteId));
                                                } catch (error) {
                                                    console.error('Error deleting message:', error);
                                                }
                                                setShowConfirmModal(false);
                                                setDeleteId(null);
                                            }
                                        }}
                                        className="form-button"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowConfirmModal(false);
                                            setDeleteId(null);
                                        }}
                                        className="form-button cancel-button"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HospitalAddDesc;


