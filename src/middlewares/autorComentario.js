import Comment from "../comentarios/comentarios.model.js";

export const validarAutorComentario = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.usuario._id; // Usuario autenticado

        // Buscar el comentario
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comentario no encontrado" });
        }

        // Verificar que el usuario es el autor del comentario
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "No tienes permisos para modificar este comentario por que no es tuyo bobo" });
        }

        // Pasar el comentario al request para evitar otra consulta en la BD
        req.comment = comment;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en la validación del comentario :)" });
    }
};