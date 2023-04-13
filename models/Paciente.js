import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        require:true,
    },
    email: {
        type: String,
        require:true,
    },
    fecha: {
        type: Date,
        require:true,
        default: Date.now(),
    },
    sintomas: {
        type: String,
        require:true,
    },
    doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Docotr'
    },
},
{
timestamps: true,
}
);

const Paciente = mongoose.model('Paciente', pacientesSchema)

export default Paciente;