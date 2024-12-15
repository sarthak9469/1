import './App.css'
import './General.css';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import DoctorList from './Components/DoctorList';
import ConsultationRequest from './Components/ConsultationRequests';
import DoctorConsultations from './Components/DoctorConsultations';
import SetPassword from './Components/SetPassword';
import ConsultationDetails from './Components/ConsultationDetails';
import PatientConsultations from './Components/PatientConsultations';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DoctorProfile from './Components/DoctorProfile';
import PatientConsultationsDetails from './Components/PatientConsultationsDetails';
// import ChatComponent from './Components/ChatComponent';


const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem('role');
  return isAuthenticated() && role === requiredRole ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />

        <Route path='/api/doctors' element={<ProtectedRoute requiredRole="patient"><DoctorList /></ProtectedRoute>} />
        <Route path='/api/doctor/:doctorId/slots' element={<ProtectedRoute requiredRole="patient"><ConsultationRequest /></ProtectedRoute>} />
        <Route path="/api/patients/consultations" element={<ProtectedRoute requiredRole="patient"> <PatientConsultations /> </ProtectedRoute>} />
        <Route path="/api/doctors/consultations" element={<ProtectedRoute requiredRole="doctor"> <DoctorConsultations /> </ProtectedRoute>} />
        <Route path="/consultation/:consultationId" element={<ProtectedRoute requiredRole="doctor"><ConsultationDetails /></ProtectedRoute>} />
        <Route path="/api/patient/consultation/:consultationId" element={<ProtectedRoute requiredRole="patient"><PatientConsultationsDetails /></ProtectedRoute>} />
        {/* <Route path="/chat/:consultationId" element={<ProtectedRoute requiredRole="doctor"><ChatComponent /> </ProtectedRoute>} /> */}
        <Route path="/api/set-password" element={<SetPassword />} />
        <Route path="/api/doctors/profile" element={<ProtectedRoute requiredRole="doctor"><DoctorProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;