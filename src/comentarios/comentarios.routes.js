import { Router } from "express";
import { check } from "express-validator";
import { agregarComentario, listarComentarios } from "./comentarios.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarAutorComentario } from "../middlewares/autorComentario.js";
import {validarCampos} from "../middlewares/validar-campos.js";

const router = Router();

router.get("/", listarComentarios);
router.post(
    "/",
    [
        validarJWT,
        check("content", "El contenido es obligatorio").not().isEmpty(),
        check("postId", "Post es obligatoria").not().isEmpty(),
        validarCampos
    ],
    agregarComentario
);



export default router;