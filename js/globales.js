//JSON que almacena información de hijos, nietos, papás y abuelos
let datos = {
    hijos: [],
    ascendientes: [],
    colaterales: []
};

function getDatos(){

    return datos;

}

function getDatosHijos(){

    return datos.hijos;

}
function getDatosAscendientes(){

    return datos.ascendientes;

}
function getDatosColaterales(){

    return datos.colaterales;

}
function setDatosPersona(datoPersona, valor){

    datos[datoPersona] = valor;

}
function setDatosHijos(objeto){

    datos.hijos.push(objeto); 

}
function setDatosNietos(indice, objeto){

    datos.hijos[indice]['nietos'].push(objeto);

}
function setDatosAscendientes(objeto){

    datos.ascendientes.push(objeto);

}
function setDatosColaterales(objeto){

    datos.colaterales.push(objeto);

}
function borraHijos(){

    datos.hijos = []

}
function borraNietos(indice){

    datos.hijos[indice]['nietos'] = [];

}
function borraAscendientes(){

    datos.ascendientes = [];

}
function borraColaterales(){

    datos.colaterales = [];

}

export {getDatos, getDatosHijos, getDatosAscendientes, getDatosColaterales, setDatosPersona, setDatosHijos, setDatosNietos, setDatosAscendientes, setDatosColaterales, borraHijos, borraNietos, borraAscendientes, borraColaterales, datos};

/*

Ejemplo de la estructura:

datos = {

    nombrePersona: 'Peter Parker',
    fechaFallecimiento: '2020-05-12',
    hijos: [

        {nombre: 'Iván', vivo: true},
        {nombre: 'María', vivo: true},

    ],
    ascendientes: [

        {nombre: 'Iván', vivo: true},
        {nombre: 'María', vivo: true},

    ],
    colaterales: [

        {nombre: 'Iván', vivo: true},
        {nombre: 'María', vivo: true},

    ]

}*/
