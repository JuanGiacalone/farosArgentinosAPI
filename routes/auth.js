import express from 'express'
import mongoose from 'mongoose'
const authRouter = express.Router();

// Se define el modelo para guardar el documento auth
const Auth = mongoose.model('Auth', { secret: String })

// Se define una promesa a resolver. Realiza una peticion a la base en busqueda del secreto
const secretPromise = new Promise((resolve,rej) => {
    setTimeout(() => {
        resolve(
                Auth.findOne()
                )
    }, 3000);
})

// Una vez resulta la promesa, se almacena el secreto, este puede existir o no. Depende de si se ha inicializado la app
// utilizando el endpoint /init
// Se exporta el secreto obtenido para que sea utilizado por las rutas
var secret = secretPromise.then((response) =>{
    console.log('AUTH -> Se resolvió la promesa de autenticación exitosamente ✔')
    if(response) {
        secret = response.secret
        console.log('AUTH -> Ejecutandosé con credenciales administrativas ✔');
    } else {
        secret = undefined
        console.log('AUTH -> Ejecutandosé sin credenciales administrativas 📛');
    }
})

// Endpoint de inicializacion de autenticacion basica, en caso de no existir se acepta un usuario y contrasenia usando el header autentication tipo Basic
// en formato: Basic xxxxxxxx
authRouter.post('/init', async (req,res) => {

    // Si no existe un secreto, se acepta el recibido
    if(!secret) {
        const authToSave = new Auth ({secret: req.headers.authorization})
        await authToSave.save().then(() => res.json({message: 'Autenticación configurada, guardar las credenciales enviadas'}))
        secret = req.headers.authorization
        console.log('AUTH -> Se configuro una nueva Autenticacion ✔');
    } else {
        // Si ya existe se rechaza la solicitud
        res.json({message: 'La aplicación ya cuenta con credenciales administrativas (Ya fue inicializada la autenticacion.)'})
    }
})

authRouter.get('/refresh', async (req,res) => {

    console.log('Refrescando el estado de la autenticación...')
    try {
        let refreshSecretPromise = new Promise((resolve,rej) => {
            setTimeout(() => {
                resolve(
                        Auth.findOne()
                        )
            }, 3000);
        })

         refreshSecretPromise.then((response) =>{

            console.log('AUTH -> Promesa de refresco finalizada exitosamente ✔')
            if(response) {
                secret = response.secret
                console.log('AUTH -> Aplicación corriendo con autenticacion ✔');
            } else {
                secret = undefined
                console.log('AUTH -> Aplicación corriendo sin autenticación 📛');
            }

        })
        res.json({mesagge:'Se inició exitosamente el proceso de refresco de crendenciales'})
    } catch (error) {
        res.json({message: error})
    }
})

authRouter.get('/reset', async (req,res) => {

    console.log('AUTH -> Volviendo a configurar las credenciales')
    try {
        if (secret === undefined) {
            res.json({message:'No existen credenciales'})
            console.log('AUTH -> La aplicación continua corriendo sin autenticación 📛');
        } else {
            if ( (secret === req.headers.authorization)  ) {

                let resetSecretPromise = new Promise((resolve,rej) => {
                    setTimeout(() => {
                        resolve( Auth.deleteOne())}, 3000);
                })

                resetSecretPromise.then((response) =>{
                    console.log('AUTH -> Promesa de reseteo finalizada exitosamente ✔')
                    if(response.deletedCount) {
                        secret = undefined
                        console.log('AUTH -> Se limpiaron las credenciales existentes, corriendo sin autenticación 📛');
                        res.json({message: 'Se removieron los credenciales existentes satisfactoriamente.'})
                    }})
            } else {
                console.log('AUTH -> 📛 Se produjo un intento de autenticacion fallido para intentar reconfigurar las credenciales 📛.');
                res.json({message: 'Credenciales incorrectas o inexistentes.'})
            }

        }

    } catch (error) {
        res.json(error)
    }
})


export {authRouter, secret}
