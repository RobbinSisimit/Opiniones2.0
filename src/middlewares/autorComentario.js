import Comment from "../comentarios/comentarios.model.js";

export const validarAutorComentario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario._id;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado"
            });
        }

        if (comment.author.toString() !== usuarioId.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para modificar este comentario por que no estuyo gran bobo :>|"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al validar autor del comentario",
            error
        });
    }
};