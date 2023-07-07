import axios from "axios";

const PUERTO = process.env.APP_PUERTO || 3000;
  
const host = `http://localhost:${PUERTO}/`
  
const endpoint = 'comentarios/'
  
const idFaro = '1'

const options = {
  method: 'PUT',
  url: host + endpoint + idFaro,
  data: {
    comentarios: { 
      idFaro:3,
      fecha: '12/9/2022',
      nombre: 'JpPablos con idFarosss test',
      email: 'a@a.com',
      cuerpo: 'akslkja;ls;jkldjaksdlkajsjdalkxaklsjdlakjsdlaksmxalksjdalskdjalskdmmxlkmasksajjdsadsajsajsljdsljasjsakjsksadsajkdsajkkjdsalkjdsakjdsakjdsjaksjdk1!!!!kal;skdlka;slaaaaaaaaaaaaaaaaaaaaaaasdwe asd3e     asdawrr asdasdasdasdasd sd d s d!!!a sdasddwasdwawsad'
    },
  }
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});

    
