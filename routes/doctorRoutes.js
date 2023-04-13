import express from "express";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
} from "../controllers/doctorController.js";

router.post("/", registrar);
router.get("/perfil",checkAuth, perfil);
router.get("/confirmar/:token", confirmar);
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword)

router
 .route('/olvide-password/:token')
 .get(comprobarToken)
 .post(nuevoPassword)

 router.put('/perfil/:id', checkAuth, actualizarPerfil)
 router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;