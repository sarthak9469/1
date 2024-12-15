const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');


exports.setPassword = async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Invalid or missing token/password' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;


        let user;
        let userType;

        user = await Doctor.findOne({ where: { email } });
        userType = 'doctor';

        if (!user) {
            user = await Patient.findOne({ where: { email } });
            userType = 'patient';
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({ password: hashedPassword });

        res.status(200).json({ message: `Password created successfully` });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Invalid token or expired token' });
    }
};


exports.login = async (req, res) => {
    console.log('Received login request:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await Doctor.findOne({ where: { email } }) || await Patient.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Invalid Email' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            {
                id: user instanceof Doctor ? user.doctorId : user.patientId, 
                email: user.email,
                role: user instanceof Doctor ? 'doctor' : 'patient'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1hr' }
        );
        res.json({ message: 'Login successful', token, role: user instanceof Doctor ? 'doctor' : 'patient' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};