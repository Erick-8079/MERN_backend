import mongoose from "mongoose";
import generarId from "../helpers/generarId.js";
import bcrypt from 'bcrypt'


const doctorSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  token: {
    type: String, 
    default: generarId(),
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});

//Hashear Passwords
doctorSchema.pre('save', async function(next) {
  if(!this.isModified("password")){
      next()
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
});

//comprobar el password
doctorSchema.methods.comprobarPasword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password)
}  

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
