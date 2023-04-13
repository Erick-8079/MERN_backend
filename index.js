import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import doctorRoute from './routes/doctorRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();
app.use(express.json());
dotenv.config();

conectarDB();


const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
   origin: function(origin, callback) {
    if(dominiosPermitidos.indexOf(origin) !== -1 ) {
        //El Origin del Request esta permitido
        callback(null, true)
    }else {
        callback(new Error('No permitido por CORS'))
    }
   }
}
app.use(cors(corsOptions));



  app.use("/api/doctores", doctorRoute);
  app.use("/api/pacientes", pacienteRoutes);

  const PORT = process.env.PORT || 4000

  app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puero ${PORT}`);
  });
