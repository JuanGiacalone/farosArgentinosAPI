
import axios from "axios";

const PUERTO = process.env.APP_PUERTO || 3000;

const host = `http://localhost:${PUERTO}/`

const endpoint = 'faros/faro'

const idFaro = '3'

const options = {method: 'GET', url: host + endpoint + idFaro};
  
axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
  });