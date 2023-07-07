import express from 'express';
const comentariosRouter = express.Router();
import {comentarioModel} from '../models/Comentario.js'
import {secret} from './auth.js'



comentariosRouter.get('/', async (req, res) => {
    try {
        res.send( await comentarioModel.find())
    } catch (error) {
        res.send( error )
    }

});

comentariosRouter.get('/:idFaro', async (req, res) => {
  
    try {
        let comentarios = await comentarioModel.findOne({idFaro: req.params.idFaro}).select('comentarios')
        if (comentarios) {
            res.send(comentarios)
        } else {
            res.json({message: "No existe faro con idFaro: " + req.params.idFaro})
        }
    } catch (error) {
        res.send(error)
    }

});



comentariosRouter.put('/:idFaro', async (req, res) => {

  // const comentarios = new comentarioModel({
  //   comentarios: req.body.comentarios
  // })

  try {
    const nuevoComentario = await comentarioModel.findOneAndUpdate(
      {idFaro: req.params.idFaro}, 
      {$addToSet: {comentarios: req.body.comentarios}},
      {new:true})

    if (nuevoComentario) {
        // Ubico el indice del comentario insertado
        const indexUltimoComentario = nuevoComentario.comentarios.length;
        // Envio el comentario insertado
        res.json(nuevoComentario.comentarios[indexUltimoComentario-1]);
        
        // Si no existe...
      } else res.json( { message: 'No existe faro con idFaro:' + (req.params.idFaro)});} 
      
  catch (error) {
    res.json( { message: error })
  }
    
});

comentariosRouter.delete('/:idFaro&:idComentario', async (req, res) =>{

    if (req.headers.authorization === secret || secret === undefined ) {

        try {

            // Se busca el documento comentario correspondiente al idFaro insertado y se hace un pull del Objeto comentario con idComentario
            const comentario = await comentarioModel
            .updateOne({ idFaro: req.params.idFaro },
                       {$pull: {comentarios: { _id:req.params.idComentario} }});

            // Si el idFaro no existe, matchedCount es 0. Es la primera parte de la query de updateOne
            if(!comentario.matchedCount) {res.json({message: 'No existe faro con idFaro: ' + req.params.idFaro + comentario})};

            // Si el idFaro es correcto pero el comentario no existe o no es correcto el idComentario ingresado
            if(comentario.matchedCount && !comentario.modifiedCount) {
                res.json({message: 'No existe comentario con id: ' + req.params.idComentario })

                // Caso de exito...
            } else {
                res.json( {message: 'Se elimino el comentario con id: ' + req.params.idComentario })
            }

        } catch (error) {
            res.json( { message: error })
        }

    } else res.json({message: 'Credenciales incorrectas o inexistentes.'})


})

export async function eliminaDocComentario(idFaro) {
  try {
    let comm = await comentarioModel.deleteOne({ idFaro:idFaro })
    return comm

  } catch (error) {
    return error
  }
}

export {comentariosRouter}



