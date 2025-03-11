import Comment from "./comentarios.model.js";
import Post from "../post/post.model.js";

export const agregarComentario = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const userId = req.usuario._id;  // Obtenemos el ID del usuario autenticado

        // Verificar que la publicación existe
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        // Crear el comentario
        const newComment = new Comment({
            content,
            author: userId,
            post: postId
        });

        // Guardar en la base de datos
        await newComment.save();

        res.status(201).json({ msg: "Comentario agregado correctamente", newComment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al agregar comentario" });
    }
};

export const editarComentario = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.usuario._id; // Usuario autenticado

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comentario no encontrado" });
        }

        comment.content = content;
        await comment.save();

        res.json({ msg: "Comentario actualizado correctamente", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al editar comentario" });
    }
};

export const eliminarComentario = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.usuario._id; 

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comentario no encontrado :(" });
        }

        await Comment.findByIdAndDelete(commentId);

        res.json({ msg: "Comentario eliminado correctamente :D" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar comentario Esta mal en algo" });
    }
};