const { SelectiveClinic : Clinic } = require('../models');

const getClinics = async(req,res,next)=>{
    try{
        const clinics = await Clinic.findAll();
        return res.json({ clinics });
    }catch(error){
        console.error(error);
        next(error);
    }
}

module.exports = { getClinics };