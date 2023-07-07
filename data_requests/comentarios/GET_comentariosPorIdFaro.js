import axios from "axios";

const PUERTO = process.env.APP_PUERTO || 3000;

const host = `http://localhost:${PUERTO}/`

const endpoint = 'comentarios/'

const idFaro = '2'

const options = {method: 'GET', url: host + endpoint + idFaro};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
