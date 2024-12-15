import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/ConsultationDetails.css'
import Navbar from './Navbar';

const ConsultationDetails = () => {
    const { consultationId } = useParams();
    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateMessage, setUpdateMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    

    const url = "http://localhost:4000";

    useEffect(() => {
        const fetchConsultationDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${url}/api/consultations/${consultationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setConsultation(response.data);
            } catch (err) {
                setError('Error fetching consultation details.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsultationDetails();
    }, [consultationId]);
    

    const updateStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${url}/api/consultations/${consultationId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setUpdateMessage(response.data.message);
            setConsultation((prev) => ({ ...prev, status: newStatus }));
        } catch (err) {
            setError('Error updating consultation status.');
        }
    };

    const handleModalToggle = () => setShowModal(!showModal);

 
    if (loading) return <p>Loading consultation details...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="consult-details">
            {consultation && (
                <div>
                    <Navbar />
                    <div className='inner-box'>
                        <h1>Consultation Details</h1>
                        <h3>Patient: {consultation.Patient.name}</h3>
                        <p>Email: {consultation.Patient.email}</p>
                        <p>
                            Date/Time: {new Date(consultation.slot).toLocaleString('en-GB', {
                                timeZone: 'UTC',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            })}
                        </p>
                        <p>Reason: {consultation.reason}</p>
                        <p>Description: {consultation.description}</p>
                        <p>Status: {consultation.status}</p>

                        {updateMessage && <p className="success">{updateMessage}</p>}

                        {consultation.status === 'pending' && (
                            <div className="status-button-accept">
                                <button onClick={() => updateStatus('Accepted')}>Accept</button>
                                <div className="status-button-reject">
                                    <button onClick={() => updateStatus('Rejected')}>Reject</button>
                                </div>
                            </div>
                        )}

                        {consultation.status === 'Accepted' && (
                            <div className="completed">
                                <button onClick={() => updateStatus('Completed')}>Mark as Completed</button>
                            </div>
                        )}

                        {consultation.images && consultation.images.length > 0 ? (
                            <div className="consultation-images">
                                <h4>Images:</h4>
                                <div className="row">
                                    {consultation.images.slice(0, 2).map((imageUrl, index) => (
                                        <div key={index} className="col-md-6 mb-3">
                                            <img
                                                src={imageUrl}
                                                alt={`Consultation ${index + 1}`}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: "200px", objectFit: "cover" }}
                                            />
                                        </div>
                                    ))}

                                    {consultation.images.length > 2 && (
                                        <div className="col-md-6 mb-3 d-flex align-items-center justify-content-center">
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={handleModalToggle}
                                            >
                                                + {consultation.images.length - 2} more
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p>No images available for this consultation.</p>
                        )}

                        {consultation.images && (
                            <div
                                className={`modal fade ${showModal ? "show d-block" : ""}`}
                                tabIndex="-1"
                                style={{ background: "rgba(0,0,0,0.5)" }}
                                onClick={handleModalToggle}
                            >
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">All Images</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={handleModalToggle}
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                {consultation.images.map((imageUrl, index) => (
                                                    <div key={index} className="col-md-6 mb-3">
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Document ${index + 1}`}
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: "300px", objectFit: "cover" }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleModalToggle}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultationDetails;
