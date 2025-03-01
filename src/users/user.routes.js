import { Router } from "express";
import { check } from "express-validator";
import { listarUsuarios, BuscarUsuarioID, actualizarUsuarios} from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.get("/", listarUsuarios);

router.get(
    "/BuscarID/:id",
    [
        check("id", "No es un ID Valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    BuscarUsuarioID
)

router.put(
        "/:id",
        [
            validarJWT,
            check("id", "No es un ID Válido").isMongoId(),
            check("id").custom(existeUsuarioById),
            validarCampos
        ],
        actualizarUsuarios
);
    

export default router;