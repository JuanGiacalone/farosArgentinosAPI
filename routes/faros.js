import express from 'express'
import { comentarioModel } from '../models/Comentario.js';
import { publicidadModel } from '../models/Publicidad.js';
import { eliminaDocComentario } from './comentarios.js';
import { eliminaDocPublicidad, savePublicidad } from './publicidades.js';
import { faroModel } from '../models/Faro.js';
import {secret} from './auth.js'
const farosRouter = express.Router();

// GET para todos los faros
farosRouter.get('/', async (req, res) => {
  try {

    // Implementacion de mongoose incluida con sus models
    const faros = await faroModel.find();

    if (!faros.length)
      res.json({ message: 'No hay faros cargados.'})
    else
      res.json(faros);

  } catch (error) {

    res.json( { message: error })
  }
});

// GET para un faro
farosRouter.get('/faro/:idFaro', async (req, res) => {
  
    try {
      
      const faro = await faroModel.findOne({idFaro: req.params.idFaro});

      // Verifico que exista el faro
      faro ? res.json(faro) : res.json({ message: 'No existe faro con idFaro: '+ (req.params.idFaro)+'.'});

    } catch (error) {

      res.json( { message: error })
      }

});

farosRouter.get('/faro/', async (req, res) => {
  res.json({message: 'Utilizar un idFaro para la consulta, por ejemplo: /faros/faro/12 '})
});

farosRouter.post('/batch', async (req,res) => {

    // El if valida si existe un secreto y si coincide con las credenciales recibidas O Si no existe secreto -> continua.
    if (req.headers.authorization === secret || secret === undefined) {
        let responses = []
        try {
            for (let index = 0; index < req.body.length; index++) {

                let response = await saveFaro(req.body[index])
                responses.push(response)
                console.log(index + response);
            }
            if (!responses.length) {
                res.json({message: 'Existe un problema en el body de la request, leer documentacion.'})
            } else
                res.json(responses)
        }
        catch (error) {
            res.json({message: 'Existe un problema en el body de la request, leer documentacion.', "error": error})
        }

    } else {

        res.json({message: 'Credenciales incorrectas o inexistentes.'})
    }

})

// POST - Agregar un faro
farosRouter.post('/', async (req, res) => {

    if (req.headers.authorization === secret || secret === undefined) {

        try {
            let response = await saveFaro(req.body)
            res.json(response)

        } catch (error) {
            res.json({message: 'Existe un problema en el body de la request, leer documentacion.'})
        }
    } else res.json({message: 'Credenciales incorrectas o inexistentes.'})

  })

farosRouter.delete('/:idFaro', async (req, res) => {

    if (req.headers.authorization === secret || secret === undefined) {

        try {
            // Verifico que exista el id faro
            const faroExiste = await faroModel
            .findOne({idFaro: req.params.idFaro})
            .select('idFaro');

            if(!faroExiste) {
                res.json({message: 'No existe faro con idFaro: '+ (req.params.idFaro) + '.'})
            } else {

                // Elimina el faro segun el idFaro ingresado por parametro
                let faroAEliminar = await faroModel.deleteOne({ idFaro : req.params.idFaro})

                // Elimina el comentario segun el idFaro ingresado, se utiliza un metodo del archivo comentarios.js
                let comentarioAEliminar = await eliminaDocComentario(req.params.idFaro)
                let publicidadAEliminar = await eliminaDocPublicidad(req.params.idFaro)
                // Si ambos deletedcount son igual a 1, se elimina correctamente el faro; si esto no ocurre, se devuelve el resultado obtenido
                faroAEliminar.deletedCount && comentarioAEliminar.deletedCount&&publicidadAEliminar.deletedCount ?
                res.json( { message:'Se elimino el faro con idFaro: ' + req.params.idFaro + ' y sus documentos de comentarios y publicidad'}) :
                res.json( { message:'DeletedCount del faro: ' + faroAEliminar.deletedCount + ' | DeletedCount del doc. comentario: ' + comentarioAEliminar.deletedCount 
                          + 'DeletedCount de la publicidad'+ publicidadAEliminar.deletedCount,
                    explanation: '1 Significa que se elimino y 0 que no se elimino (puede ser que no existia)'})

            }
        } catch (error){ res.json({ messagge: error }) }

    } else res.json( {message: 'Credenciales incorrectas o inexistentes.'} )


})

// Endpoint para modificar el valor de un campo de cierto faro, idFaro y el campo ingresar por el cuerpo
// de la peticion
farosRouter.put('/modificar', async (req,res) => {


    if (req.headers.authorization === secret || secret === undefined ) {

        try {
            const faroExiste = await faroModel.findOne({ idFaro: req.body.idFaro}).select('idFaro')

            if(!faroExiste) {
                res.json({message: 'No existe faro con idFaro: '+ (req.body.idFaro)})
            } else {
                let arr = Object.entries(req.body)
                // Se insertan las entries en un arreglo
                // Se verifica que el idFaro se encuentre en el indice 0, si se encuentra en el 1 se invierte el arreglo para que
                // la asignacion que le sigue sea exitosa
                
                if ( Object.keys(req.body).indexOf('idFaro') > 0 ) {
                  arr.reverse()
                }    
                
                // Se guarda la key que se encuentra en el subarreglo 1, posicion 0
                let key = arr[1][0]

                // Se guarda el valor que se encuentra en la posicion 1 del subarreglo
                let value = arr[1][1]
                
                // Se realiza la modificacion usando $set key : value
                const modificaCampo = await faroModel.findOneAndUpdate(
                        {idFaro: req.body.idFaro},
                        {$set: {  [key] : value}},
                        { "new": true}
                        ).select(key)

                // Chequea si el campo que se quiere modificar existe, segun la respuesta de la bd
                // si no existe en la respuesta, no existe el campo
                // Entonces si existe, respondo existosamente.
                
                if (Object.keys(modificaCampo['_doc']).indexOf(key) > 0) {
                    res.json({message:'Se modifico el campo: ' + key + ' del faro con idFaro: ' + req.body.idFaro,
                        result: modificaCampo })
                } else {
                    res.json({ message: 'No existe el campo: ' + key  })
                }

            }

        } catch ( error ) {
            res.json({ messagge: error })
        }
    } else res.json( { message: 'Credenciales incorrectas o inexistentes.' } )

})


/// Inserta una nueva impresion al faro segun el param idFaro
farosRouter.put( "/:idFaro", async (req,res) => {

  try {

    const faroExiste = await faroModel
    .findOne({ idFaro: req.params.idFaro })
    .select('idFaro');
  
      if(!faroExiste) {
      res.json({ message: 'No existe faro con idFaro:'+ (req.params.idFaro)})
      } else {
        const nuevaImpresion = await faroModel.findOneAndUpdate(
          {idFaro: req.params.idFaro}, 
          {$inc: { impresiones: 1}},
          )

          res.json({ messagge: 'Se agrego una nueva impresion exitosamente'})
      
      
      }
    
  } catch (error) {
    res.json({ messagge: error })
  }

})

farosRouter.get("/top", async (req,res) => {
  try {
    // Con impresiones -1 ordeno de mayor a menor segun sus impresiones, limit hace traer maximo 5 resultados y select -> selecciono los campo q me interesan.
    const top = await faroModel.find().sort({impresiones: -1}).limit(5).exec();
    
    if (!top.length)
    res.json({ message:'No hay faros cargados.'})
  else
    res.json(top);
    
  } catch (error) {
    res.json({ messagge: error })
  }


})

async function creaComment(idFaro) {
  
    const comentario = new comentarioModel({idFaro: idFaro})
    return await comentario.save();
}


async function saveFaro (req) { 

  // Verifico que no exista el id faro
 const faroExiste = await faroModel
                    .findOne({idFaro: req.idFaro})
                    .select('idFaro');


  // Si existe ese idFaro, no se inserta
  if(faroExiste) { return ({ messagge:'El faro con idFaro: ' + faroExiste.idFaro + ' ya existe!' }) } 
  else { 
  
    // Se Instancian los modelos y se asignan los campos de la req.
    // GEOJSON requiere los campos type = Point y coordinates

    const faro = new faroModel ({

      idFaro: req.idFaro,
      nombre: req.nombre,
      provincia: req.provincia,
      accesible: req.accesible,
      accesoPago: req.accesoPago,
      impresiones:0,
      coordenadas: {type: req.coordenadas.type, coordinates: req.coordenadas.coordinates},
      descripcion: req.descripcion,
      caracteristicas: req.caracteristicas,
      historia: req.historia,
      turismo: req.turismo,
      ubicacion: req.ubicacion,
      urlImagen: req.urlImagen,
      urlVista: req.urlVista
      
    })
    
    // Guardado del faro
    try {
      
      const savedFaro = await faro.save();

      // Si se crea exitosamente, envia el faro guardado y crea un Documento tipo Comentario con los comentarios para ese faro
      // Si se crea exitosamente, guarda la publicidad default, envia los datos del faro y un true para que se utilizen los datos default de publicidad
      if (savedFaro)  {
        await creaComment(savedFaro.idFaro);
        await savePublicidad(savedFaro, true)
        return (savedFaro)

                // Mensaje segun el exito del guardado
      } else  return ({message: 'No se pudo guardar el faro'})

    } catch (error) {
      return ( { message: error })
    }
  } 
}

export {farosRouter};


