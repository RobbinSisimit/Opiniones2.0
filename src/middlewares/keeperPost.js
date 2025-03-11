import Post from "../post/post.model.js";

export const validarPermisosPost = async (req, res, next) => {
    try {
        const { postId } = req.params; 
        const userId = req.usuario._id; 
        console.log("postId recibido:", postId);

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        if (post.keeper.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "No tienes permisos para modificar esta publicación" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en la validación de permisos" });
    }
};