# NodeJsExpressMongoDBtest

API Rest con MongoDB - Mongoose y Express / Backend para sitio web turistico de faros.

## Endpoints
- *POST* /auth/init -> (Opcional) Inicializa la autenticacion para la app, enviar en el header autenticacion en modo Basic. Un usuario y contrasenia (La generacion de autenticacion es opcional)
- *GET* /auth/refresh -> Refresca el estado del secreto en la aplicacion, realiza consulta a la base de datos.
- *GET* /auth/reset -> Resetea la autenticacion a el estado inicial, sin secreto. Requiere de autenticacion si es que existe.
-------------------------------------------------------------------------------------------------------------
- *GET* /faros/ -> Devuelve todos los faros
- *GET* /faros/faro/$idFaro$ -> Devuelve el faro segun idFaro
- *GET* /faros/top - > Devuelve el top 5 de faros con mayor impresiones
- *POST* /faros/ -> Crea un faro, usar el archivo FarosJson.json - Ademas, crea un documento comentario con el idFaro como clave secundaria. (Puede requerir Autenticación)
- *POST* /faros/batch -> Crea multiples faros, enviar como arreglo de objetos: [{faro0}, {faro1}...] (Puede requerir Autenticación)
- *PUT* /faros/$idFaro$ -> Registra una nueva impresion
- *PUT* /faros/modificar -> Modifica un campo, el cuerpo a usar: { idFaro: X , campo:valor } (Puede requerir Autenticación)
- *DELETE* /faros/$idFaro$ -> Elimina el faro y su documento comentario relacionado. (Puede requerir Autenticación)
------------------------------------------------------------------------------------------------------------
- *GET* /comentarios/ -> Devuelve todos los documentos de tipo comentario 
- *GET* /comentarios/$idFaro$ -> Devuelve los comentarios del faro especificado 
- *PUT* /comentarios/$idFaro$ -> Agrega comentarios al documento Comentario del faro indicado \
- *DELETE* /comentarios/$idFaro$&$idComentario$ -> Elimina un comentario segun idFaro y el idComentario (Puede requerir Autenticación)
-------------------------------------------------------------------------------------------------------------
- *GET* /publicidades/ -> Devuelve todos los documentos de tipo publicidad
- *GET* /publicidades/$idFaro$ -> Devuelve la publicidad del faro indicado por idFaro
- *POST* /publicidades/ -> Crea una publicidad para el faro indicado en el cuerpo de la peticion (Puede requerir Autenticación)
- *DELETE* /publicidades/$idFaro$ -> Elimina la publicidad segun el idFaro ingresado (Puede requerir Autenticación)


## Configuracion local
1. Clonar
2. Crear archivo .env con el campo DB_CONNECTION con el valor de la connection string de la base MongoDB a utilizar
3. Configurar en el mismo archivo la variable APP_PUERTO, para definir el puerto de comunicacion
4. Configurar la variable DB_NAME para indicar el nombre de la base. 
5. npm install
6. npm start
## Testear los endpoints
1. Usar los .js de la carpeta axios_requests, ademas se encuentran los formato de cuerpo en formato JSON para realizar las peticiones
2. Correrlos con node NombreArchivo.js o utilizando postman
3. Modificar parametros de entrada segun necesidad, ingresar datos de autenticacion en caso que se haya activado.
