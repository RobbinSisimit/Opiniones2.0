'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from "../src/users/user.routes.js"
import categoryRoutes from "../src/categoria/categoria.routes.js"
import postRoutes from "../src/post/post.routes.js"

import Categoria from '../src/categoria/categoria.model.js'
import Usuario from "../src/users/user.model.js";
import { hash } from "argon2";

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) =>{
    app.use("/GestorOpiniones/v1/auth", authRoutes);
    app.use("/GestorOpiniones/v1/users", userRoutes);
    app.use("/GestorOpiniones/v1/categorias", categoryRoutes);
    app.use("/GestorOpiniones/v1/post", postRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion Exitosa Con La Base De Datos :p");
        await crearCategoriaGeneral()
    } catch (error) {
        console.log("Error Al Conectar Con La Base De Datos", error);
    }
};

const crearAdmin = async () => {
    try {
        const adminExistente = await Usuario.findOne({ role: "ADMIN_ROLE" });

        if (!adminExistente) {
            const passwordEncriptada = await hash("Admin123");

            const admin = new Usuario({
                name: "Admin",
                username: "admin",
                email: "admin@gmail.com",
                phone: "123456789",
                password: passwordEncriptada,
                role: "ADMIN_ROLE"
            });

            await admin.save();
            console.log("Administrador creado exitosamente :p");
        } else {
            console.log("El administrador ya existe.:p");
        }
    } catch (error) {
        console.error("Error al crear el administrador :(", error);
    }
};

const crearCategoriaGeneral = async () => {
    try {
        const defaultCategory = await Categoria.findOne({ name: "General" });
        if (!defaultCategory) {
            await Categoria.create({ name: "General" });
            console.log("Categoría por defecto creada: General :D");
        } else {
            console.log("Categoría por defecto ya existente :D");
        } 
    } catch (error) {
        console.error("Error al inicializar categorías :(", error);
    }
};

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3012;

    await conectarDB();
    await crearAdmin();
    configurarMiddlewares(app);
    configurarRutas(app);

    app.listen(port, () => {
        console.log(`Server Running On Port ${port}`);
    });
}