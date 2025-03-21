import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const listarUsuarios = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;

        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error Al Obtener Usuario :(",
            error
        });
    }
};

export const BuscarUsuarioID = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado :("
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error Al Obtener Usuario D:",
            error
        });
    }
};

export const actualizarUsuarios = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;

        if (req.usuario.role === "USER_ROLE" && id !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                msg: "No está autorizado para actualizar la información de otro usuario bobo :("
            });
        }

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado :("
            });
        }

        res.status(200).json({
            success: true,
            msg: "Usuario Actualizado :>)",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error Al Actualizar Usuario :( (pipipi)",
            error
        });
    }
};
