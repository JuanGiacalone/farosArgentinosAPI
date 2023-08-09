import express from 'express'
import mongoose from 'mongoose'
import ServerApiVersion from 'mongoose'
import bodyParser from 'body-parser';
import dotenv from 'dotenv/config'
import cors from 'cors';

// Seteo de puertos y base a utilizar
const PORT = process.env.APP_PORT;
const DB =  process.env.DB_NAME || 'farosArg_01'

// Instancia de la App
const app = express();


// Configuracion de variables para aceptar requests de gran tamanio (Faros por Batch)
app.use(express.json({limit: '50mb', extended: true}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// app.use(auth)... en este caso al usar cualquier ruta, se realiza un auth..

// Rutas importadas
import {farosRouter} from './routes/faros.js'
import {comentariosRouter} from './routes/comentarios.js'
import {publicidadesRouter } from './routes/publicidades.js'
import {authRouter, secret} from './routes/auth.js'


// Middleware parser para los cuerpos q se utilizen

app.use(bodyParser.json())

// Middleware para poder ejecutar las peticiones desde cualquier sitio usando cors
app.use(cors())

// Indexacion del middleware para /faros y /comments a su ruta

app.use('/faros',farosRouter)
app.use('/comentarios',comentariosRouter)
app.use('/auth',authRouter)
app.use('/publicidades', publicidadesRouter)



// Conexion a BD

mongoose.connect(
    process.env.DB_CONNECTION,
    {
        dbName: DB,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
      }, 
    (err) => {
        err ?  console.log(err + ' ❌ ') : console.log( `DB -> Conexión exitosa a la base ${DB} ✔`,)
} )


// Configuracion del el puerto de escucha
app.listen(PORT)
console.log( `APP -> Ejecutandose en el puerto : ${PORT} ✔`)


