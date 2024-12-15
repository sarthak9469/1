import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Navbar = () => {
    const userRole = localStorage.getItem('role');
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="navbar">
            <ul>
                {userRole === 'patient' && (
                    <li><NavLink to="/api/doctors" activeClassName="active">Doctors</NavLink></li>
                )}
                {userRole === 'patient' && (
                    <li><NavLink to="/api/patients/consultations" activeClassName="active">My Consultation</NavLink></li>
                )}
                {userRole === 'doctor' && (
                    <li><NavLink to="/api/doctors/consultations" activeClassName="active">Home</NavLink></li>
                )}
                {userRole === 'doctor' && (
                    <li><NavLink to="/api/doctors/profile" activeClassName="active">Profile</NavLink></li>
                )}

                <li className="logout">
                    <a href="#" onClick={() => setIsModalOpen(true)}>Logout</a></li>
            </ul>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Logout Confirmation"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '300px',
                    },
                }}
            >
                <h2>Confirm Logout</h2>
                <p>Are you sure you want to log out?</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={handleLogout} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>
                        Logout
                    </button>
                    <button onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#ccc', padding: '10px', border: 'none', borderRadius: '5px' }}>
                        Cancel
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default Navbar;