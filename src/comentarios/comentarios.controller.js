import Comment from "./comentarios.model.js";
import Post from "../post/post.model.js";
import User from "../users/user.model.js"

export const agregarComentario = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const [user, post] = await Promise.all([
            User.findById(req.usuario._id),
            Post.findById(postId)
        ]);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "el usuario no exite"
            });
        }

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "no hay post con ese ID ?? copia bien el ID o saber que estas haciendo mal :D"
            });
        }

        const comment = new Comment({
            content, 
            author: user._id, 
            post: post._id, 
            status: true 
        });

        await comment.save();

        res.status(200).json({
            success: true,
            message: "se agrego tu comentario cuidado te funan",
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al publicara comentarios :??",
            error
        });
    }
};

export const listarComentarios = async(req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {status: true};
    try {
        const comments = await Comment.find(query)
        .populate("author", "name")
        .populate("post", "title")
        .skip(Number(desde))
        .limit(Number(limite));
            
        const total = await Comment.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            comments
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error al listar comentarios por que no se :D",
            error
        })
    }
}

export const editarComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });

        res.status(200).json({
            success: true,
            message: "Comentario actualizado correctamente",
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al editar el comentario",
            error
        });
    }
};

export const eliminarComentario = async (req, res) => {
    try {
        const { id } = req.params;

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Comentario eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el comentario",
            error
        });
    }
};

