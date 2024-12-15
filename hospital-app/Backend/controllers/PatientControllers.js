const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Consultation = require('../models/consultation');
const Image = require('../models/image');
const {sendVerificationEmail, sendEmail} = require('../middleware/sendVerificationEmail');
const baseUrl = 'http://localhost:4000';



exports.registerPatient = async (req, res) => {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        const existingPatient = await Patient.findOne({ where: { email } });
        if (existingPatient) return res.status(400).json({ error: 'Email is already registered' });

        const newPatient = await Patient.create({ name, email });
        const token = jwt.sign({ email: newPatient.email, id: newPatient.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await sendVerificationEmail(newPatient.email, token);
        res.status(201).json({ message: 'Patient registered, check email to set password.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            attributes: ['doctorId', 'name', 'email', 'specialization']
        });

        const formattedDoctors = doctors.map(doctor => ({
            doctorId: doctor.doctorId,
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization,
            // availableSlots: doctor.availableSlots || []
        }));

        res.status(200).json(formattedDoctors);
    } catch (error) {
        console.error('Error fetching doctors:', error); // More specific error logging
        res.status(500).json({ error: 'An error occurred while fetching doctors' });
    }
};

exports.getDoctorSlots = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findByPk(doctorId, {
            attributes: ['doctorId', 'name', 'availableSlots']
        });

        console.log('Doctor ID:', doctorId);
        console.log('Fetched doctor:', doctor);


        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.status(200).json({
            doctorId: doctor.doctorId,
            name: doctor.name,
            availableSlots: doctor.availableSlots || []
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching available slots' });
    }
};

exports.requestConsultation = async (req, res) => {
    const { doctorId, slot, reason, description } = req.body;
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);
    console.log('Patient ID:', req.userId);


    if (!doctorId || !slot) {
        return res.status(400).json({ error: 'Doctor ID and slot are required' });
    }

    try {
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        if (!doctor.availableSlots || !doctor.availableSlots.includes(slot)) {
            return res.status(400).json({ error: 'Slot not available' });
        }

        if (!req.userId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const newConsultation = await Consultation.create({
            patientId: req.userId,
            doctorId,
            slot,
            status: 'pending',
            reason,
            description
        });

        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map(file => `uploads/${file.filename}`);
            for (let imageUrl of imageUrls) {
                await Image.create({
                    consultationId: newConsultation.id,
                    imageUrl
                });
            }
        }

        res.status(201).json({
            message: 'Consultation requested successfully',
            consultation: newConsultation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during the consultation request' });
    }
};

exports.getConsultationsForPatient = async (req, res) => {
    try {
        const patientId = parseInt(req.userId, 10);
        const { status } = req.query;  // Get the status filter from query params

        const whereClause = { patientId };
        if (status && status !== 'all') {
            whereClause.status = status;  // Add filter by status if provided
        }

        const consultations = await Consultation.findAll({
            where: whereClause,
            include: [
                {
                    model: Doctor,
                    attributes: ['name', 'specialization']
                },
                {
                    model: Patient,
                    attributes: ['name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (!consultations.length) {
            return res.status(200).json({ message: 'No consultations found for this patient' });
        }

        res.status(200).json({ consultations });
    } catch (error) {
        console.error('Error fetching consultations for patient:', error);
        res.status(500).json({ error: 'An error occurred while fetching consultations' });
    }
};


exports.getPatientConsultationDetails = async (req, res) => {
    try {
        const { consultationId } = req.params;

        const consultation = await Consultation.findOne({
            where: { id: consultationId },
            include: [
                {
                    model: Doctor,
                    attributes: ['name', 'email']
                },
                {
                    model: Image,
                    attributes: ['imageUrl']
                }
            ]
        });

        if (!consultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }

        let images = [];
        if (consultation.Images && consultation.Images.length > 0) {
            images = consultation.Images.map(image => {
                return `${req.protocol}://${req.get('host')}/${image.imageUrl}`
        });
        }

        res.status(200).json({
            ...consultation.toJSON(),
            images: images
        });
    } catch (error) {
        console.error("Error fetching consultation details:", error);
        res.status(500).json({ error: 'An error occurred while fetching consultation details' });
    }
};