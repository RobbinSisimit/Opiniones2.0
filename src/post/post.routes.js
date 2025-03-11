import { Router } from "express";
import { check } from "express-validator";
import {crearPost, listarPost, eliminarPost , editarPost} from "./post.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js";
import {validarJWT} from "../middlewares/validar-jwt.js";

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

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    editarPost
)


router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No Es Un ID Valido").isMongoId(),
        validarCampos
    ],
    eliminarPost
)

export default router;
