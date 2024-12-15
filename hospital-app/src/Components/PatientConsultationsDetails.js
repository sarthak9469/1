import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../css/PatientConsultationDetails.css';


const PatientConsultationsDetails = () => {
    const { consultationId } = useParams();
    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchConsultationDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You are not logged in');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/patient/consultation/${consultationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setConsultation(response.data);
            } catch (err) {
                setError('An error occurred while fetching consultation details.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsultationDetails();
    }, [consultationId]);


    const handleModalToggle = () => setShowModal(!showModal);


    if (loading) return <p>Loading details...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className='details'>
            <div>
                <Navbar />
                <div className='inner-container'>
                    <h1>Consultation Details</h1>

                    {consultation ? (
                        <div className="profile-detail">
                            <h2>Consultation with Dr. {consultation.Doctor.name}</h2>
                            <p>Email: {consultation.Doctor.email}</p>
                            <p>Status: {consultation.status}</p>
                            <p>Slot: {new Date(consultation.slot).toLocaleString()}</p>
                            <p>Reason: {consultation.reason}</p>
                            <p>Description: {consultation.description}</p>

                            {/* Display images */}
                            {consultation.images && consultation.images.length > 0 ? (
                                <div className="consultation-image">
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


                            {/* Modal to display all images */}
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
                    ) : (
                        <p>No consultation details available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientConsultationsDetails;
