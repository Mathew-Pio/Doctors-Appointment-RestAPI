import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';

export const authenticate = async (req, res, next) => {
    // get the token from headers
    const authToken = req.headers.authorization

    // check if the token exists
    if(!authToken || !authToken.startsWith('Bearer ')){
        return res.status(401).json({success: false, message: 'No token, authorization needed'})
    }

    try {
        const token = authToken.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userId = decodedToken.id
        req.role = decodedToken.role

        next();
    } catch (err) {
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({message: 'Token expired'})
        }
        return res.status(401).json({success: false, message:'Invalid Token'})
    }
}


export const restrict = roles => async (req, res, next) => {
    const userId = req.userId
    let user;

    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if(patient){
        user = patient;
    }
    if(doctor){
        user = doctor;
    }
    if(!roles.includes(user.role)){
        return res.status(401).json({message: "You're not authorized"})
    }
    next();

}











