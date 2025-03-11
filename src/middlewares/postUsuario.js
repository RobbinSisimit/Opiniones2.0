export const validatePostOwnership = (req, res, next) => {
    // Validación de si el usuario tiene el rol de "USER_ROLE" y no es el dueño de la publicación
    if (req.usuario.role === "USER_ROLE" && req.post.keeper.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ 
            success: false, 
            msg: "No autorizado para eliminar esta publicación" 
        });
    }
    // Si pasa la validación, continuar con el siguiente middleware o controlador
    next();
};
