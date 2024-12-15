import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; 
import '../css/PatientConsultations.css'; 

const PatientConsultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredConsultations, setFilteredConsultations] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchConsultations = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You are not logged in');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:4000/api/patients/consultations', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        status: filterStatus
                    }
                });

                if (response.data.consultations) {
                    setConsultations(response.data.consultations);
                    setFilteredConsultations(response.data.consultations);
                } else {
                    setConsultations([]);
                    setFilteredConsultations([]);
                }
            } catch (err) {
                setError('An error occurred while fetching consultations.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, [filterStatus]);

    const handleFilterChange = (event) => {
        const status = event.target.value;
        setFilterStatus(status); 
    };

    return (
        <div className='list'>
            <div>
            <Navbar />
            <div className='box'>
            <h1>Your Consultation Requests</h1>

            <div class="filter-container">                <label htmlFor="statusFilter">Filter by Status: </label>
                <select 
                    id="statusFilter" 
                    value={filterStatus} 
                    onChange={handleFilterChange} 
                    style={{ padding: '5px', marginBottom: '20px' }}
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {loading ? (
    <p>Loading consultations...</p>
) : error ? (
    <p className="error">{error}</p>
) : filteredConsultations.length === 0 ? (
    <p>You haven't made any consultations yet.</p>
) : (
    <div className="consults-lists">
        {filteredConsultations.map((consultation) => (
            <div className="item" key={consultation.id}>
                <h2>Consultation with Dr. {consultation.Doctor.name}</h2>
                <p>Status: {consultation.status}</p>
                <p>Slot: {new Date(consultation.slot).toLocaleString()}</p>

                {/* View details link */}
                <Link to={`/api/patient/consultation/${consultation.id}`}>
                    <button>View Details</button>
                </Link>
            </div>
        ))}
    </div>
)}
</div>
        </div>
        </div>
    );
};

export default PatientConsultations;
