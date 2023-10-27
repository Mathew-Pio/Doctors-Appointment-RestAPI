import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = user => {
    return jwt.sign({id:user._id, role: user.role}, process.env.JWT_SECRET_KEY, 
        { expiresIn: '10h' }
    )
}

export const signup = async (req, res) => {
    const { email, password, name, role, photo, gender } = req.body;
    try{
        let user;
        if(role === 'patient'){
        user = await User.findOne({email});
        }else if(role === 'doctor'){
            user = await Doctor.findOne({email});
        }

        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

        // hashing of password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if(role === 'patient'){
            user = new User({
                name,
                email,
                password: hashedPassword,
                photo,
                gender,
                role
            })
        }
        if(role === 'doctor'){
            user = new Doctor({
                name,
                email,
                password: hashedPassword,
                photo,
                gender,
                role
            })
        }

        await user.save();

        return res.status(201).json({success: true, message: 'User successfully created'});
    }catch(err){
        return res.status(500).json({success: false, message: 'Internal server error. Try again'});
    }
}

export const login = async (req, res) => {
    const { email } = req.body;
    try{
        let user;

        const patient = await User.findOne({email});
        const doctor = await Doctor.findOne({email});

        if(patient){
            user = patient;
        }
        if(doctor){
            user = doctor;
        }

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);       

        if(!isPasswordMatch){
            return res.status(400).json({ status:false, message: 'Invalid credentials' });
        }

        const token = generateToken(user)

        const { password, role, appointments, ...rest } = user._doc

        return res.status(200).json({status: true, message: 'Successfull login', token, data: {...rest}})
    }catch(err){
        return res.status(500).json({status:false, message:'Failed to login' })
    }
}