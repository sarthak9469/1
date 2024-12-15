import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import "react-datepicker/dist/react-datepicker.css";
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import '../css/DoctorProfile.css';


function DoctorProfile() {
    const [doctor, setDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [removedSlots, setRemovedSlots] = useState([]);
    const [newSlotDate, setNewSlotDate] = useState(null);
    const [newSlotTime, setNewSlotTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const url = "http://localhost:4000";

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await axios.get(`${url}/api/doctor/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDoctor(response.data);
                const slots = Array.isArray(response.data.availableSlots)
                    ? response.data.availableSlots
                    : JSON.parse(response.data.availableSlots || '[]');
                setAvailableSlots(slots);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setErrors("Error fetching doctor details");
            }
        };

        fetchDoctorDetails();
    }, [navigate]);

    const handleRemoveSlot = async (slot) => {
        if (window.confirm("Are you sure you want to delete this slot?")) {
            const filteredSlots = availableSlots.filter(s => s !== slot);
            setAvailableSlots(filteredSlots);
            setRemovedSlots(prevRemovedSlots => [...prevRemovedSlots, slot]);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await axios.delete(
                    `${url}/api/doctors/remove-available-slots`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        data: { removedSlots: [slot] }
                    }
                );
                alert(response.data.message); // Show success message
            } catch (error) {
                setErrors('Error removing available slots');
                console.error(error);
            }
        }
    };

    const handleAddSlot = async () => {
        if (!newSlotDate || !newSlotTime) {
            setErrors("Please select a date and time for the slot.");
            return;
        }
        const newSlot = `${newSlotDate.toISOString().split('T')[0]} ${newSlotTime}`;

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const response = await axios.post(
                `${url}/api/doctors/add-available-slots`,
                { newSlots: [newSlot] },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setAvailableSlots(response.data.availableSlots);
            setNewSlotDate(null);
            setNewSlotTime("");
            alert(response.data.message); // Show success message
        } catch (error) {
            setErrors('Error adding new slot');
            console.error(error);
        }
    };

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const response = await axios.put(
                `${url}/api/doctors/update-profile`,
                {
                    workExperience: doctor.workExperience,
                    about: doctor.about,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert(response.data.message);
            setIsEditing(false);
        } catch (error) {
            setErrors('Error updating profile');
            console.error(error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };


    const handleCancelEdit = () => {
        setIsEditing(false);
        setDoctor((prevDoctor) => ({
            ...prevDoctor,
            workExperience: prevDoctor.workExperience,
            about: prevDoctor.about,
        }));
    };


    return (
<div className="doctor-profile">
    <Navbar />
    <h1>Doctor Profile</h1>
    <div className="content-container">
        <div className="profile-section">
            {errors && <span className="error">{errors}</span>}
            <div className="profile-details">
                <p><strong>Name:</strong> {isEditing ? <input type="text" value={doctor?.name} onChange={(e) => setDoctor({ ...doctor, name: e.target.value })} /> : doctor?.name}</p>
                <p><strong>Email:</strong> {isEditing ? <input type="email" value={doctor?.email} onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} /> : doctor?.email}</p>
                <p><strong>Specialization:</strong> {isEditing ? <input type="text" value={doctor?.specialization} onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })} /> : doctor?.specialization}</p>
                <p><strong>Work Experience(in years):</strong> {isEditing ? <input type="text" value={doctor?.workExperience || ''} onChange={(e) => setDoctor({ ...doctor, workExperience: e.target.value })} /> : doctor?.workExperience}</p>
                <p><strong>About:</strong> {isEditing ? <textarea value={doctor?.about || ''} onChange={(e) => setDoctor({ ...doctor, about: e.target.value })} /> : doctor?.about}</p>
            </div>

            {isEditing ? (
                <div>
                    <button onClick={handleUpdateProfile}>Save Changes</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            ) : (
                <button onClick={handleEditClick}>Edit</button>
            )}
        </div>

        <div className="slots-section">
            <h2>Available Slots</h2>
            {loading ? (
                <Skeleton count={3} height={20} />
            ) : (
                <div className="slots-list">
                    {availableSlots.length === 0 ? (
                        <p>No available slots</p>
                    ) : (
                        <ul>
                            {availableSlots.map((slot, index) => (
                                <li key={index}>
                                    {slot}
                                    <button onClick={() => handleRemoveSlot(slot)} className="remove-slot-btn">Remove</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {!loading && (
                <div className="add-slot">
                    <div className="datepicker-container">
                        <DatePicker
                            selected={newSlotDate}
                            onChange={date => setNewSlotDate(date)}
                            minDate={new Date()}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Date"
                        />
                    </div>
                    <input
                        type="time"
                        value={newSlotTime}
                        placeholder="Select a time"
                        onChange={(e) => setNewSlotTime(e.target.value)}
                    />
                    <button onClick={handleAddSlot}>Add Slot</button>
                </div>
            )}
        </div>
    </div>
</div>

    );
}

export default DoctorProfile;
