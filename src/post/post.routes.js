import { Router } from "express";
import { check } from "express-validator";
import {crearPost, listarPost, eliminarPost , editarPost} from "./post.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js";
import {validarJWT} from "../middlewares/validar-jwt.js";
import { validarPermisosPost } from "../middlewares/keeperPost.js";

const router = Router();
router.post(
    "/",
    [
        validarJWT,
        check("title", "El título es obligatorio").not().isEmpty(),
        check("category", "La categoría es obligatoria").not().isEmpty(),
        check("content", "El contenido es obligatorio").not().isEmpty(),
        validarCampos
    ],
    crearPost
)
router.get("/", listarPost);

router.put('/:Id', validarJWT,validarPermisosPost, editarPost);


router.delete(
    "/:id",
    [
        validarJWT,
        validarPermisosPost
    ],
    eliminarPost
)

export default router;
