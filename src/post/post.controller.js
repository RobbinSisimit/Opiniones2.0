import User from "../users/user.model.js"
import Post from "../post/post.model.js"
import Category from "../categoria/categoria.model.js"

export const crearPost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const user = await User.findById(req.usuario._id); 

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Usuario No Encontrado"
            });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Categoría no válida"
            });
        }

        const post = new Post({
            title,
            category,
            content,
            keeper: user._id,
            status: true
        });

        await post.save();

        res.status(200).json({
            success: true,
            message: "Publicación Creada",
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al guardar la Publicación",
            error
        });
    }
};

export const listarPost = async(req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };
    
    try {
        const posts = await Post.find(query)
            .populate("keeper", "name")
            .populate("category", "name")
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            posts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones",
            error
        });
    }
};

export const editarPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, image, status } = req.body;
        const post = await Post.findByIdAndUpdate(id, { title, description, category, image, status },{new: true});

        res.status(200).json({
            success: true,
            msg: "Categoria actualizada :D",
            post
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al editar la publicación" });
    }
};

export const eliminarPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        await Post.findByIdAndDelete(postId);

        res.json({
            msg: "Publicación eliminada correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar la publicación" });
    }
};
