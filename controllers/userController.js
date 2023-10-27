import User from '../models/UserSchema.js';

export const updateUser = async (req, res) => {
    const id = req.params.id;
    try{
        let updatedUser;
        updatedUser = await User.findByIdAndUpdate(id, 
            {$set: req.body}, 
            {new: true}
        )

        return res.status(200).json({success: true, message: 'User successfully updated', data: updatedUser});
    }catch(err){
        return res.status(500).json({success: false, message: 'Failed to update'});
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    try{
         await User.findByIdAndDelete(id)

        return res.status(200).json({success: true, message: 'User successfully deleted'});
    }catch(err){
        return res.status(500).json({success: false, message: 'Failed to delete'});
    }
}

export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try{
         const user = await User.findById(id).select("-password");

        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }
        return res.status(200).json({success: true, message: 'User found', data: user});
    }catch(err){
        return res.status(500).json({success: false, message: 'Failed to delete'});
    }
}

export const getAllUsers = async (req, res) => {
    const id = req.params.id;
    try{
         const users = await User.find({}).select("-password");

        if(!users){
            return res.status(404).json({success: false, message: 'Users not found'})
        }
        return res.status(200).json({success: true, message: 'Users found', data: users});
    }catch(err){
        return res.status(500).json({success: false, message: 'Failed to find users'});
    }
}