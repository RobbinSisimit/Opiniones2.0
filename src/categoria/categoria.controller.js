import Categoria from '../categoria/categoria.model.js';
import Post from '../post/post.model.js'

export const crearCategoria = async (req, res) =>{
    try{
        const {name} = req.body;
        const categoria = new Categoria({name});
        await categoria.save();
        res.status(200).json({
            successf: true,
            msg: "Categoria creado :D",
            categoria
        })
    }catch(error){
        res.status(500).json({
            success: false,
            msg:"Error al crear la categoria bobo",
            error
        });
    }
};

export const listarCategoria = async (req, res)=>{
    try{
        const categorias = await Categoria.find({status:true});
        res.status(200).json({
            success: true,
            msg: "Categorias listadas :D",
            categorias
        })
    }catch(error){
        res.status(500).json({
            success: false,
            msg: "Error al listar la categoria bobo",
            error
        })
    }
};

export const actulizarCategoria = async (req, res) =>{
    try{
        const { id } = req.params;
        const { name } = req.body;
        const categoria = await Categoria.findByIdAndUpdate(id, {name}, {new: true});

        res.status(200).json({
            success: true,
            msg: "Categoria actualizada :D",
            categoria
        })
    }catch(error){
        res.status(500).json({
            succes: true,
            msg: "Error al actualizar la categoria bobo",
            error
        });
    }
};

export const EliminarCategoria = async (req, res) =>{
    try{
        const { id } = req.params;
        const categoria = await Categoria.findById(id);

        if(!categoria){
            return res.status(400).json({
                success: false,
                msg: "Categoria no existe :("
            })
        }

        const defaultCategory = await Categoria.findOne({ name: 'General' });
        if (!defaultCategory) {
            return res.status(404).json({
                message: "No hay categoría por defecto para asignarle los productos"
            });
        }

        const postSincategoria = await Post.find({ categoria: id });

        await Post.updateMany({categoria: id}, { categoria: defaultCategory._id });

        defaultCategory.post.push(...postSincategoria.map(post => post._id));
        defaultCategory.markModified('post');
        await defaultCategory.save();

        const deleteCategoria = await Categoria.findByIdAndDelete(id);
        res.status(200).json({
            msg: "Categoria eliminada :D",
            deleteCategoria
        })
    }catch(error){
        res.status(500).json({
            message: "Error al eliminar categoria",
            error: error.message
        });

    }
}
