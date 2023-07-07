import axios from "axios";

const PUERTO = process.env.APP_PUERTO || 3000;

const host = `http://localhost:${PUERTO}/`

const endpoint = 'comentarios/'

const idFaro = '21'

const idComentario = '6325d80eee855b90211a15fe'

const options = {
  method: 'DELETE',
  url: host + endpoint + idFaro + '&' + idComentario
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
