import { Router } from "express";
import { agregarComentario, editarComentario, eliminarComentario } from "./comentarios.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarAutorComentario } from "../middlewares/autorComentario.js";
import {validarCampos} from "../middlewares/validar-campos.js";

const router = Router();


router.post(
    "/",
    [
        validarJWT,
        
    ],
    agregarComentario
);


router.put("/:commentId",
    [
        validarJWT, 
        validarAutorComentario,
    ], 
    editarComentario
);

router.delete(
    "/:commentId",
    [
        validarJWT, 
        validarAutorComentario, 
    ],
    eliminarComentario
);

export default router;