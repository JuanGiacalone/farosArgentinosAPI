import mongoose from 'mongoose'

/// type: mongoose.Schema.Types.ObjectId,

const comentarioSchema = mongoose.Schema({
    
  idFaro: {  type: Number, 
              required: true, 
              ref:'Faro'},

  comentarios: [{
    fecha: Date,
    nombre: String,
    email: String,
    cuerpo: String
  }]
  },{ versionKey: false });


export const comentarioModel = mongoose.model('Comentario', comentarioSchema);
