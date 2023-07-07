import express from 'express';
const publicidadesRouter = express.Router();
import {publicidadModel} from '../models/Publicidad.js'
import publicidadDefault from '../data/publicidadDefault.json' assert {type: 'json'}
import {secret} from './auth.js'



publicidadesRouter.get('/', async (req, res) => {
    try {
        res.send( await publicidadModel.find())
    } catch (error) {
        res.send( error )
    }

});

publicidadesRouter.get('/:idFaro', async (req, res) => {
  
    try {
        let publicidad = await publicidadModel.findOne({idFaro: req.params.idFaro})
        if (publicidad) {
            res.send(publicidad)
        } else {
            res.json({message: "No existe publicidad para el faro con idFaro: " + req.params.idFaro})
        }
    } catch (error) {
        res.send(error)
    }

});



publicidadesRouter.post('/', async (req, res) => {

    if (req.headers.authorization === secret || secret === undefined) {

        try {
            // Se inserta un false como segundo parametro ya que se entiende que al utilizar el post, se desea ingresar una publicidad distinta a la default
            let response = await savePublicidad(req.body, false)
            res.json(response)

        } catch (error) {
            console.error(error);
            res.json({message: 'Existe un problema en el body de la request, leer documentacion.'})
        }
    } else res.json( {message: 'Credenciales incorrectas o inexistentes.'} )

})

publicidadesRouter.delete('/:idFaro', async (req, res) =>{

    if (req.headers.authorization === secret || secret === undefined ) {

        try {

            // Se busca el documento comentario correspondiente al idFaro insertado y se hace un pull del Objeto comentario con idComentario
            const publicidad = await publicidadModel.deleteOne({ idFaro: req.params.idFaro })
                       

            // Si el idFaro no existe, matchedCount es 0. Es la primera parte de la query de updateOne
            if  (!publicidad.deletedCount) {
                res.json({message: 'No existe publicidad para el faro con idFaro: ' + req.params.idFaro})
                console.log(publicidad);
            } else {
                res.json( {message: 'Se elimino la publicidad para el faro con idFaro: ' + req.params.idFaro })}

        } catch (error) {
            res.json( { message: error })
        }

    } else res.json({message: 'Credenciales incorrectas o inexistentes.'})


})
 //  La funcion acepta la request y en caso que se trate de un faro recien ingresado sin publicidad propia, se insertara la publicidadDefault
export async function savePublicidad (req, def) { 

    // Verifico que no exista el id faro para no pisar la publicidad
   const publicidadExiste = await publicidadModel.findOne({idFaro: req.idFaro})

    // Si existe ese idFaro, no se inserta
    if(publicidadExiste){ 

        return ({ messagge:'El faro con idFaro: ' + publicidadExiste.idFaro + ' ya tiene su publicidad!' }) 

    } else {

    let publicidad = Object


    // Se Instancian el modelo y se asignan los campos de la req.
    // Si def es falso, se inserta la publicidad con los datos de la request, si es verdadero se utilizan los datos default
    if (!def) {
        publicidad = new publicidadModel ({
  
            idFaro: req.idFaro,
            nombre: req.nombre,
            descripcion: req.descripcion,
            urlUbicacion: req.urlUbicacion,
            urlSitio: req.urlSitio,
            creada: new Date()
          })
    } else {
        publicidad = new publicidadModel ({
  
            idFaro: req.idFaro,
            nombre: publicidadDefault.nombre,
            descripcion: publicidadDefault.descripcion,
            urlUbicacion: publicidadDefault.urlUbicacion,
            urlSitio: publicidadDefault.urlSitio,
            creada: new Date()
          })
    }

      
      // Guardado de la publicidad
      try {
        
        const savedPublicidad = await publicidad.save();
        return (savedPublicidad)
        } 
    catch (error) {
        return ( { message: error })
      }
    } 
  }

export async function eliminaDocPublicidad(idFaro) {
  try {
    let pub = await publicidadModel.deleteOne({ idFaro:idFaro })
    return pub

  } catch (error) {
    return error
  }
}

export {publicidadesRouter}



