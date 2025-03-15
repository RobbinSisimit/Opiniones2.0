import User from "../users/user.model.js"
import Post from "../post/post.model.js"
import Category from "../categoria/categoria.model.js"
import Comment from "../comentarios/comentarios.model.js";

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

export const listarPost = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        const posts = await Post.find(query)
            .populate("keeper", "name")
            .populate("category", "name")
            .skip(Number(desde))
            .limit(Number(limite))
            .lean(); // Convierte los documentos a objetos JavaScript puros

        // Obtener los comentarios de cada post
        const postIds = posts.map(post => post._id);
        const comments = await Comment.find({ post: { $in: postIds }, status: true })
            .populate("author", "name")
            .lean();

        // Agregar los comentarios a cada post
        const postsConComentarios = posts.map(post => ({
            ...post,
            comments: comments.filter(comment => comment.post.toString() === post._id.toString())
        }));

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            posts: postsConComentarios
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones con comentarios :(",
            error
        });
    }
};

export const editarPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, ...data } = req.body;

        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: "Usuario no valido"
            });
        }

        const post = await Post.findById(id).populate("keeper");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "no hay publicacion :D"
            });
        }

        if (req.usuario.role === "USER_ROLE" && post.keeper._id.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "esta no es tu publicacion BOBO :(" 
            });
        }

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: "No existe esta categoria bobo copie bien"
                });
            }
            post.category = category;
        }

        Object.assign(post, data);
        await post.save();

        res.status(200).json({
            success: true,
            msg: "post actulizado (happy happy)",
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "ENQUE ESTA MAL, EN ALGO",
            error
        });
    }
};

export const eliminarPost = async(req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "no hay publicacion con ese ID"
            });
        }

        if (req.usuario.role === "USER_ROLE" && post.keeper.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "este no es tu publicacion vete :D" 
            });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: "publicacion elminada :D"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "ESTA MAL EN ALGO",
            error
        });
    }
};
