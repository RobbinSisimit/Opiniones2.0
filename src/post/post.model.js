import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "El titulo es obligatorio :D"]
    },
    category: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',  
        required: true 
    },
    content: {
        type: String,
        required: [true, "El contenido es obligatorio :D"]
    },
    keeper:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type:Boolean,
        default: true
    }
}, {
    timestamps: true,  
    versionKey: false   
});

export default mongoose.model("Post", PostSchema);