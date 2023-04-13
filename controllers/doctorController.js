import Doctor from "../models/Doctor.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";

import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email,nombre } = req.body;

  //prevenir usuarios duplicados
  const existeUsuario = await Doctor.findOne({ email });
  if (existeUsuario) {
    const error = new Error("El usuario ya esta registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    //Guardar nuevo doctor
    const doctor = new Doctor(req.body);
    const doctorGuardado = await doctor.save();

    //enviar email
    emailRegistro({
      email,
      nombre,
      token: doctorGuardado.token,
    });

    res.json({ doctorGuardado });
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { doctor } = req;

  res.json({ doctor });
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Doctor.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //Comprobar si el usuario existe
  const usuario = await Doctor.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  //comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu Cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Revisar el password
  if (await usuario.comprobarPasword(password)) {
    //Autenticar
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id)
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const {email} = req.body
  //si no existe el usuario
  const existeDoctor = await Doctor.findOne({email});
  if(!existeDoctor) {
    const error = new Error("El Usuario no existe");
    return res.status(400).json({msg: error.message});
  }  
  //si existe el usuario
  try {
    existeDoctor.token = generarId()
    await existeDoctor.save();

        //enviar email
        emailOlvidePassword({
          email,
          nombre: existeDoctor.nombre,
          token: existeDoctor.token,
        });

    res.json({msg: "Hemos enviado un email con las instrucciones"});
  } catch (error) {
    console.log(error);
  }  
};

const comprobarToken = async (req, res) => {
  const { token } = req.params
  
  const tokenValido = await Doctor.findOne({token});

  if(tokenValido){
    //token valido y usuario existe
    res.json({msg: 'Toquen válido y el usuario existe'})
  }else{
    const error = new Error('Token no válido')
    return res.status(400).json({msg: error.message})
  }
};

const nuevoPassword = async (req, res) => {
  const {token} = req.params;
  const {password} = req.body;
  //Token no valido
  const doctor = await Doctor.findOne({token});
  if(!doctor) {
    const  error = new Error('Hubo un error');
    return res.status(400).json({msg: error.message}); 
  }  
  //token valido y si existe usuario
  try {
    doctor.token = null;
    doctor.password = password;
    await doctor.save();
    res.json({msg: "Password modificado correctamente"});
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body;
  if (doctor.email !== req.body.email) {
    const existeEmail = await Doctor.findOne({ email });
    if (existeEmail) {
      const error = new Error("El email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    doctor.nombre = req.body.nombre;
    doctor.email = req.body.email;

    const doctorActualizado = await doctor.save();
    res.json(doctorActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  //Leer los datos
  const { id } = req.doctor;
  const { pwd_actual, pwd_nuevo } = req.body;

  //Comprobar que el doctor existe
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }
  //Comprobar su password
  if(await doctor.comprobarPasword(pwd_actual)) {
    //Almacenar el nuevo password
    doctor.password = pwd_nuevo;
    await doctor.save();
    res.json({msg: 'Password Almacenado Correctamente'})
  }else {
    const error = new Error("El password Actual es incorrecto");
    return res.status(400).json({ msg: error.message });
  }
  
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
