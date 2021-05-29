
async function consulta() {
    var result4 = [];
    var con1 = document.getElementById('opciones').value;
    const consulta2 = { con: con1 };
    const options2 = {
        method: "POST",
        body: JSON.stringify(consulta2),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response2 = await fetch('/agenda', options2);
    result4 = await response2.json();

    select = document.getElementById('opciones');

    for (var i = 0; i < result4.length; i++) {
        var opt = document.createElement('option');
        opt.value = result4[i].Especialidad;
        opt.innerHTML = result4[i].Especialidad;
        select.add(opt);

    }
}

async function doctors(s1, s2) {
    var con1 = document.getElementById('opciones').value;
    const consulta2 = { con: con1 };
    const options2 = {
        method: "POST",
        body: JSON.stringify(consulta2),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response2 = await fetch('/doctor', options2);
    result5 = await response2.json();

    var s1 = document.getElementById(s1);
    var s2 = document.getElementById(s2);

    s2.innerHTML = "";

    select = document.getElementById('Doctores');
    for (var i = 0; i < result5.length; i++) {
        if (s1.value == result5[i].Especialidad) {
            var opt = document.createElement('option');
            opt.value = result5[i].Nombres;
            opt.innerHTML = result5[i].Nombres;
            select.add(opt);
        }
    }
    $("#Doctores").prepend('<option selected="true" value="0">Seleccionar profesional de la salud</option>');
}




document.onload = loadFunctions();
function loadFunctions() {
    consulta();
}
