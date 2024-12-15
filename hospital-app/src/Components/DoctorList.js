import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import '../css/DoctorList.css';

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [errors, setErrors] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const url = "http://localhost:4000";

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}/api/doctors`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDoctors(response.data);
            } catch (error) {
                setErrors("Error fetching doctors");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [navigate]);

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="doctor-list">
            <div>
                <Navbar />
                <div className='inner-boxes'>
                    <h1>Doctors</h1>
                    {errors && <span className="error">{errors}</span>}
                    <input
                        type="text"
                        placeholder="Search by name or specialization"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    {loading ? (
                        <p>Loading doctors...</p>
                    ) : (
                        <div className="doctor-boxes">
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doctor) => (
                                    <div className="doctor-box" key={doctor.doctorId}>
                                        <h3>Dr. {doctor.name}</h3>
                                        <p>Email: {doctor.email}</p>
                                        <p>Specialization: {doctor.specialization}</p>

                                        <Link to={`/api/doctor/${doctor.doctorId}/slots`}>
                                            <button className="book-slots-btn">Book Slot</button>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p>No doctors match your search criteria.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

    );

}

export default DoctorList;