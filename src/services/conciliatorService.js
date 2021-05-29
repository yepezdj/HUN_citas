import connection from "../configs/connectDB";
import gmailController from "../controllers/gmailController";

let EmailAceptar = async (variablesAceptar) => {

    var body;
    console.log(variablesAceptar.correo)
    if (!variablesAceptar.descripcion) {
        if (variablesAceptar.Cita == 'Ayudas diagnósticas') {
            body = `<h4>Estimado/a ${variablesAceptar.nombre} ${variablesAceptar.apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su cita médica ha sido aceptada para el ${variablesAceptar.fecha} a las ${variablesAceptar.hora}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`;
        } else {
            body = `<h4>Estimado/a ${variablesAceptar.nombre} ${variablesAceptar.apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su cita médica ha sido aceptada con el/la ${variablesAceptar.doctor} para el ${variablesAceptar.fecha} a las ${variablesAceptar.hora}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`;
        }
    } else {
        if (variablesAceptar.Cita == 'Ayudas diagnósticas') {
            body = `<h4>Estimado/a ${variablesAceptar.nombre} ${variablesAceptar.apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su ayuda diagnóstica ha sido aceptada para el ${variablesAceptar.fecha} a las ${variablesAceptar.hora}    
    <hr class="my-4">
    </div>
    <div class="text-center mb-2">
    ${variablesAceptar.descripcion}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`;
        } else{
        body = `<h4>Estimado/a ${variablesAceptar.nombre} ${variablesAceptar.apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su solicitud de cita médica ha sido aceptada con el/la ${variablesAceptar.doctor} para el ${variablesAceptar.fecha} a las ${variablesAceptar.hora}
    <hr class="my-4">
    </div>
    <div class="text-center mb-2">
    ${variablesAceptar.descripcion}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`
            ;
        }
    }
    gmailController.sendEmailNormal(variablesAceptar.correo, 'Solicitud de cita médica-HUN', body)

};

let EmailDeclinar = async (variablesDeclinar) => {

    var body;
    console.log(variablesDeclinar.correo)
    if (!variablesDeclinar.descripcion) {
        if (variablesDeclinar.Cita == 'Ayudas diagnósticas') {
            body = `<h4>Estimado/a ${variablesDeclinar.nombre} ${variablesDeclinar.apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su ayuda diagnóstica ha sido rechazada para el ${variablesDeclinar.fecha} a las ${variablesDeclinar.hora}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`;
        }else{  body = `<h4>Estimado/a ${variablesDeclinar.nombre} ${variablesDeclinar.apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su solicitud de cita médica ha sido rechazada con el/la ${variablesDeclinar.doctor} para el ${variablesDeclinar.fecha} a las ${variablesDeclinar.hora}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`;}
    } else {
        if (variablesDeclinar.Cita == 'Ayudas diagnósticas') {
            body = `<h4>Estimado/a ${variablesDeclinar.nombre} ${variablesDeclinar.apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su solicitud de ayuda diagnóstica ha sido rechazada para el ${variablesDeclinar.fecha} a las ${variablesDeclinar.hora}
    <hr class="my-4">
    </div>
    <div class="text-center mb-2">
    Debido a la/s siguiente/s razón/es:
    ${variablesDeclinar.descripcion}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`
            ;
        }else{
        body = `<h4>Estimado/a ${variablesDeclinar.nombre} ${variablesDeclinar.apellido}</h4>
        <div class="text-center mb-2">
    Se le informa que su solicitud de cita médica ha sido rechazada con el/la ${variablesDeclinar.doctor} para el ${variablesDeclinar.fecha} a las ${variablesDeclinar.hora}
    <hr class="my-4">
    </div>
    <div class="text-center mb-2">
    Debido a la/s siguiente/s razón/es:
    ${variablesDeclinar.descripcion}
    </div>
    <hr class="my-4">
    <div class="text-center mb-2">
      ¿Tiene alguna inquietud al respecto? Favor comunicarse a la línea
      <a href="#" class="register-link">
      (57) (5) 3858131
      </a>
      </div>`
            ;}
    }
    gmailController.sendEmailNormal(variablesDeclinar.correo, 'Solicitud de cita médica-HUN', body)
};

module.exports = {
    EmailAceptar: EmailAceptar,
    EmailDeclinar: EmailDeclinar

};