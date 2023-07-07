import axios from "axios";

const PUERTO = process.env.APP_PUERTO || 3000;

const host = `http://localhost:${PUERTO}/`

const endpoint = 'faros/'

const options = {
  method: 'POST',
  url: host + endpoint,
  headers: {'Content-Type': 'application/json; charset=utf-8'},
  data: {
    "idFaro": 3,
    "nombre": "Punta Norte NOAccesible Gratis",
    "provincia" : "Chubut",
    "coordenadas": {
      "coordinates": [
        -42.07484804987889, -63.76651582230084
      ],
      "type": "Point"
    },
   "accesible": false,
   "accesoPago": false

}
  };

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
