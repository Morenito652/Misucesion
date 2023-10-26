import {getDatos, getDatosAscendientes, getDatosColaterales, setDatosPersona, setDatosHijos, setDatosNietos, setDatosAscendientes, setDatosColaterales, getDatosHijos, borraHijos, borraNietos, borraAscendientes, borraColaterales} from './globales.js';

//Div que contiene todas las tarjetas del carousel
let listaTarjetas = document.querySelector('.carousel-inner');

//Flechas de navegación
let flechaAtras = document.querySelector('#flecha-anterior');
let flechaSiguiente = document.querySelector('#flecha-siguiente');

//El primer botón, que inicia el programa
let btnIniciar = document.querySelector('#btn-iniciar');

//Nos indica si la persona está viva o no
let estaVivo;
//Nos indica si el check está activo o no
let checado;

let indicesHijosVivos = [];
let indicesHijosFallecidos = [];
let indicesHjosConNietos = [];
let listaHijosVivos = [];
let listaHijosFallecidos = [];
let contadorNietos = 1;
let tipoColateral;
let tipoConyuge;
let hayConyuge = false;

let tipoCaso;
//validaFlecha maneja la navisibilidad de flechaAtras y flechaSiguiente
flechaAtras.addEventListener('click', validaFlecha);
flechaSiguiente.addEventListener('click', validaFlecha);

btnIniciar.addEventListener('click', validaFlecha);


let nombrePersona = 'Persona 1'
let fechaFallecimientoOriginal = document.querySelector('#fecha');

//El id que usarán los botones del programa
let idBotonSiguiente = 1;

// Tipos enumerados
let tipoClases = Object.freeze({
    Persona:'dato-persona',
    Hijo:'dato-hijo',
    Nieto:'dato-nieto',
    Padre:'dato-padre',
    Abuelo:'dato-abuelo',
    Bisabuelo: 'dato-bisabuelo',
    Ascendientes: 'dato-ascendiente',
    Descendientes: 'dato-descendiente',
    Colaterales: 'dato-colateral'
});
let tarjetas = Object.freeze({
    testamento:'testamento',
    propiedades:'propiedades',
    hijos:'hijos',
    nietos: 'nietos',
    padres: 'padres',
    colaterales: 'colaterales',
    fechaFallecimiento:'fechaFallecimiento',
    ascendientes: 'ascendientes',
    conyuge: 'conyuge',
    resultado: 'resultado'
});


//Aparecer o desaparecer flechas de navegación
function validaFlecha(){

    switch(this.id){

        case 'flecha-anterior':

            if(listaTarjetas.firstElementChild.nextElementSibling.classList.contains('active')){

                flechaAtras.classList.replace('visible', 'invisible');
        
            }
        
            if(listaTarjetas.lastElementChild.classList.contains('active')){
        
                flechaSiguiente.classList.replace('invisible', 'visible');
        
            }
            listaTarjetas.lastElementChild.classList.remove('active');

            break;

        case 'btn-iniciar':
        case 'flecha-siguiente':
            if(listaTarjetas.firstElementChild.classList.contains('active')){

                flechaAtras.classList.replace('invisible', 'visible');
        
            }
        
            if(listaTarjetas.lastElementChild.previousElementSibling.classList.contains('active')){
        
                flechaSiguiente.classList.replace('visible', 'invisible');
        
            }
            break;
    }

}

//Crear tarjeta dinámicamente
function crearTarjeta(){

    let tarjeta = document.createElement('div');
    tarjeta.classList.add('carousel-item', 'tarjeta');

    let contenido = document.createElement('div');
    contenido.classList.add('contenido');

    tarjeta.appendChild(contenido);

    listaTarjetas.appendChild(tarjeta);

}

//Esta función convierte la fecha proveniente del lenguaje javascript al formato tradicional DD/MM/AAAA
let formatoFecha = (texto) => texto.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');

//Conseguir la fecha de hoy
const hoy = new Date();
//Formato que acepta Javascript
const templateFecha = `${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}`;
fechaFallecimientoOriginal.setAttribute('max', templateFecha);
//Formato que conocemos
const formatoFechaHoy = formatoFecha(templateFecha);


datosGenerales();

// Función para la segunda tarjeta
function datosGenerales(){

    checado = document.querySelector('#input-check');
    let fechaFallecimiento = document.querySelector('#fecha-fallecimiento');

    checado.addEventListener('click', function(){

        if(!checado.checked){

            fechaFallecimiento.classList.replace('invisible', 'visible');
            fechaFallecimientoOriginal.classList.add('checar');
    
        }else{

            fechaFallecimiento.classList.replace('visible', 'invisible');
            fechaFallecimientoOriginal.classList.remove('checar');

        }

    });
    
}



document.querySelector('#contenido1').insertAdjacentHTML('beforeend', botonSiguiente());
let btnSiguiente = document.querySelector('#siguiente1');

btnSiguiente.addEventListener('click', function(e){

    validaDatosPersona(tarjetas.testamento, e.target);

    estaVivo = checado.checked;
        
    agregarActive();   
        
});


function validaDatosPersona(siguiente, objetivo){

    recolectaDatos(tipoClases.Persona);

    document.querySelector('#nombre-modal').innerText = nombrePersona;

    //Lo primero es borrar todas las tarjetas subsecuentes, en caso de que el usuario regrese en la navegación, ya que de hacer un cambio en una tarjeta, todas las siguientes contendrían información errónea
    borrarSiguientes(objetivo);

    let checar = document.querySelectorAll('.checar');
    let bandera = true;

    checar.forEach(element => {
        
        //Si el input está vacío, establecemos la bandera como falso   
        if(element.value == ""){

            //console.log('Una tarjeta no tiene valor');
            alert('Debes llenar todos los campos para continuar');

            bandera = false;

        }

    });

    //Si todos los elementos con la clase checar tienen texto, creamos la tarjeta
    if(bandera){

        decideCamino(siguiente);

    }else{

        agregarActive();

    }

    flechaSiguiente.classList.replace('visible', 'invisible');

}

function botonSiguiente(siguiente){

    let botonSiguiente = `<button type="button" class="btn btn-primary btn-siguiente next-slide" data-bs-target="#carouselExampleControls" id="siguiente${idBotonSiguiente}">Siguiente</button>`;

    idBotonSiguiente++;

    return botonSiguiente;

}

//Borra todos los nodos siguientes
function borrarSiguientes(boton){

    let divContenedor;

    if(boton.classList.contains('btn-si-no')){

        divContenedor = boton.parentElement.parentElement.parentElement;

    }else{

        divContenedor = boton.parentElement.parentElement;

    }

    let base = divContenedor.parentElement;

    if(divContenedor != base.lastElementChild){

        while(divContenedor != base.lastElementChild){

            base.removeChild(base.lastElementChild)

        } 

    }

    base.lastElementChild.classList.add('active');
}

//Genera tantas etiquetas <option> como iteraciones se manden como argumento. También se requiere el id del select
function llenaSelect(sel, iteraciones){

    //Último select creado
    let lista = sel[sel.length - 1];

    for(let i = 0; i <= iteraciones; i++){

        let opcion = `<option>${i}</option>`;

        lista.insertAdjacentHTML('beforeend', opcion);

    }

}

//Genera inputs dentro de un div a partir del número de inputs que deseemos y el tipo de los inputs (Hijos, Nietos, Padres, Abuelos)
function generaInputs(numeroInputs, tipoInput){

    // Si hay 0 iteraciones, no deseo que plantillaInputs tenga ningún texto
    let plantillaInputs = numeroInputs == 0 ? `` : `
    <div class="dos-elementos text-center">
        <div><p>Ingresa los nombres de los ${tipoInput}s:</p></div>`;

    let hijoONieto = tipoInput == 'hijo' ? 'Hijo' : 'Nieto';

    if(numeroInputs > 0){

        if(fechaFallecimientoOriginal.value == ''){

            plantillaInputs += `<div><p>Al día de hoy está vivo</p></div>`;

        }else{

            plantillaInputs += `<div><p>Al día de <strong>${formatoFecha(fechaFallecimientoOriginal.value)}</strong> estaba vivo</p></div>`;

        }

    }

    let tipoDato = tipoInput == 'nieto' ? `dato-${tipoInput}${indiceHijoActual}` : `dato-${tipoInput}`;

    for(let i = 1; i <= numeroInputs; i++){

        let plantillaIndividual = `
            <div>
                <input type="text" id="input-nombre" data-atributo="Nombre del ${tipoInput}" class="barra-texto align-self-center mx-auto ${tipoDato} text-capitalize" placeholder="${hijoONieto} ${i}">
            </div>
            <div class="align-self-center">
                <input type="checkbox" id="input-check" class="${tipoDato}" value="" checked data-atributo="vivo">
            </div>
        `;

        plantillaInputs += plantillaIndividual;
    }

    plantillaInputs += '</div>';

    //Se devuelve un string, que puede ser añadido a un div con Element.insertAdjacentHTML(posición, texto);
    return plantillaInputs;
}

// Elimina todos los hijos de un nodo a partir de su id
function eliminaHijos(id){

    var div = document.querySelector(`#${id}`);

    while (div.firstChild) {

        div.removeChild(div.firstChild);

    }

}

function decideCamino(key){

    switch(key){

        case tarjetas.testamento:
            tarjetaTestamento(tarjetas.testamento);
            break;
        case tarjetas.propiedades:
            tarjetaPropiedades(tarjetas.propiedades);
            break;
        case tarjetas.hijos:
            tarjetaHijos(tarjetas.hijos);
            break;
        case tarjetas.nietos:
            tarjetaNietos();
            break;
        case tarjetas.ascendientes:
            tarjetaAscDesc(tarjetas.Ascendientes);
            break;
        case tarjetas.colaterales:
            tarjetaColaterales();
            break;
        case tarjetas.conyuge:
            tarjetaConyuge(tipoConyuge);
            break;
        case tarjetas.resultado:
            sessionStorage.setItem("datos", JSON.stringify(getDatos()));
            sessionStorage.setItem("caso", determinaCaso());
            sessionStorage.setItem("hijosVivos", JSON.stringify(listaHijosVivos));
            sessionStorage.setItem("indicesHijosVivos", JSON.stringify(indicesHijosVivos));
            sessionStorage.setItem("hijosFallecidos", JSON.stringify(listaHijosFallecidos));
            sessionStorage.setItem("indicesHijosFallecidos", JSON.stringify(indicesHijosFallecidos));
            sessionStorage.setItem("indicesHijosConNietos", JSON.stringify(indicesHjosConNietos));
            location.href = 'resultado.html';
            break;
    }

}



//Se puede aplicar a todas las tarjetas que requieran un sí o un no como respuesta
function tarjetaSiNo(texto, tipo){

    let tipoModal;

    if(tipo == tarjetas.testamento){

        tipoModal = `

            <button type="button" class="btn btn-primary btn-si-no" data-bs-toggle="modal" data-bs-target="#modalContactar">Sí</button>
            <button type="button" id="boton-propiedades" class="btn btn-primary btn-si-no">No</button>
            
        `;

    }else if(tipo == tarjetas.propiedades){

        tipoModal = `

            <button type="button" id="boton-hijos" class="btn btn-primary btn-si-no">Sí</button>
            <button type="button" class="btn btn-primary btn-si-no" data-bs-toggle="modal" data-bs-target="#modalContactar">No</button>
            
        `;

    }else if(tipo == tarjetas.conyuge){

        tipoModal = `

            <button type="button" id="si-conyuge" class="btn btn-primary btn-si-no">Sí</button>
            <button type="button" id="no-conyuge" class="btn btn-primary btn-si-no">No</button>
        
        `;

    }else if(tipo == tarjetas.nietos){

        tipoModal = `

            <button type="button" id="si-nietos" class="btn btn-primary btn-si-no">Sí</button>
            <button type="button" id="no-nietos" class="btn btn-primary btn-si-no">No</button>
        
        `

    }else if(tipo == 'bienes menores'){

        tipoModal = `

            <button type="button" id="si-bienes" class="btn btn-primary btn-si-no">Sí</button>
            <button type="button" id="no-bienes" class="btn btn-primary btn-si-no">No</button>
        
        `

    }

    let tarjeta = document.createElement('div');
    tarjeta.classList.add('carousel-item', 'tarjeta');

    let contenido = document.createElement('div');
    contenido.classList.add('contenido');

    tarjeta.appendChild(contenido);


    let pregunta = `

        <div class="maximo-contenido">
            <p class="text-center mb-5">${texto}</p>
        </div>

        <div class="si-no">` +

    tipoModal +
        
        `</div>
    `;

    contenido.insertAdjacentHTML('beforeend', pregunta);

    listaTarjetas.appendChild(tarjeta);

    if(tipo == tarjetas.testamento){

        document.querySelector('#boton-propiedades').addEventListener('click', function (e) {
            
            borrarSiguientes(e.target);

            decideCamino(tarjetas.propiedades);

            flechaSiguiente.classList.replace('visible', 'invisible');

        });

    }else if(tipo == tarjetas.propiedades){

        document.querySelector('#boton-hijos').addEventListener('click', function(e){

            borrarSiguientes(e.target);

            decideCamino(tarjetas.hijos);

            flechaSiguiente.classList.replace('visible', 'invisible');

        });

    }else if(tipo == tarjetas.conyuge){

        contenido.insertAdjacentHTML('beforeend', muestraModalAyuda(tarjetas.conyuge));

        document.querySelector('#si-conyuge').addEventListener('click', function(e){

            borrarSiguientes(e.target);

            //decideCamino(tarjetas.resultado);

            flechaSiguiente.classList.replace('visible', 'invisible');

        });

    }else if(tipo == tarjetas.nietos){

        document.querySelector('#si-nietos').addEventListener('click', function(e){

            borrarSiguientes(e.target);

            determinaCaso();

            decideCamino(tarjetas.resultado);

            flechaSiguiente.classList.replace('visible', 'invisible');

        });

        document.querySelector('#no-nietos').addEventListener('click', () => {

            listaTarjetas.lastElementChild.classList.remove('active');
                
            let texto = `Los bienes de la/el cónyuge son menores a los que tuvo/tiene ${getDatos()['Nombre persona']}?`;

            tarjetaSiNo(texto, 'bienes menores');

            listaTarjetas.lastElementChild.classList.add('active');

        });

    }else if(tipo == 'bienes menores'){

        contenido.insertAdjacentHTML('beforeend', muestraModalAyuda('else'));

        document.querySelector('#si-bienes').addEventListener('click', () => {

            listaTarjetas.lastElementChild.classList.remove('active');

            tarjetaExplicacion();

            listaTarjetas.lastElementChild.classList.add('active');

        });

        document.querySelector('#no-bienes').addEventListener('click', () => {

            hayConyuge = false;

            determinaCaso();

            decideCamino(tarjetas.resultado);

            flechaSiguiente.classList.replace('visible', 'invisible');

        });

    }

}

function tarjetaTestamento(tipo){

    let texto = `¿${getDatos()['Nombre persona']} tiene testamento?`;

    listaTarjetas.lastElementChild.classList.remove('active');

    tarjetaSiNo(texto, tipo);

    listaTarjetas.lastElementChild.classList.add('active');

}

function tarjetaPropiedades(tipo){

    let texto = `¿${getDatos()['Nombre persona']} tiene su domicilio en CDMX o tiene propiedades en CDMX?`;

    listaTarjetas.lastElementChild.classList.remove('active');

    tarjetaSiNo(texto, tipo);

    listaTarjetas.lastElementChild.classList.add('active');

}

//Genera la tarjeta correspondiente a la pregunta de cuántos hijos tuvo la persona
function tarjetaHijos(tipo, nombre = getDatos()['Nombre persona']){

    let tarjeta = document.createElement('div');
    let id;

    if(tipo == tarjetas.hijos){

        id = 'listaHijos';

    }else{

        id = 'listaNietos'

    }
    
    tarjeta.classList.add('carousel-item', 'tarjeta');

    let contenido = document.createElement('div');
    contenido.classList.add('contenido');

    tarjeta.appendChild(contenido);

    let pregunta = `
    
        <div class="label-input mx-auto">
            <p>¿Cuántos hijos tuvo ${nombre}?</p>
            <select class="select-hijos"></select>
        </div>

    `
    contenido.insertAdjacentHTML('beforeend', pregunta);

    listaTarjetas.appendChild(tarjeta);

    let selectActual = document.querySelectorAll('.select-hijos');

    //console.log(selectActual);

    llenaSelect(selectActual, 20);

    let select = document.querySelector(`#${id}`);

    let idContenedorInputs;

    if(tipo == tarjetas.hijos){

        idContenedorInputs = 'contenedorInputsHijos';

    }else{

        idContenedorInputs = 'contenedorInputsNietos' + indiceHijoActual;

    }

    let contenedorInputs = `<div id="${idContenedorInputs}" class="mx-auto"></div>`;


    contenido.insertAdjacentHTML('beforeend', contenedorInputs);


    let btnSiguienteNietosOResultados = botonSiguiente();

    contenido.insertAdjacentHTML('beforeend', btnSiguienteNietosOResultados);


    /********Validar qué hijos han fallecido********/

    if(tipo == tarjetas.hijos){

        document.querySelector(`#siguiente${idBotonSiguiente-1}`).addEventListener('click', function(e){

            borrarSiguientes(e.target);

            contadorNietos = 1;

            recolectaDatos(tipoClases.Hijo);

            indicesHijosFallecidos = encuentraFallecidos(getDatosHijos());
            indicesHijosVivos = encuentraVivos(getDatosHijos());

            if(getDatosHijos().length == 0){

                decideCamino(tarjetas.ascendientes);
                
            }else{

                //Si no hay fallecidos, pasamos a los resultados
                if(indicesHijosFallecidos.length == 0){

                    tipoConyuge = tarjetas.hijos;

                    decideCamino(tarjetas.conyuge);

                }else{
                    //Si hay hijos fallecidos, pasamos a verificar los nietos
                    decideCamino(tarjetas.nietos);

                }

            }

            flechaSiguiente.classList.replace('visible', 'invisible');

        }); 

    }else{

        document.querySelector(`#siguiente${idBotonSiguiente-1}`).addEventListener('click', function(e){

            //borrarSiguientes(e.target);

            recolectaDatos(tipoClases.Nieto);

            decideCamino(tarjetas.nietos);

        });


    }

    

    listaTarjetas.lastElementChild.previousSibling.classList.remove('active');
    listaTarjetas.lastElementChild.classList.add('active');

    //cuando hay un cambio en el valor del select, se borra lo que hay en el div y se generan nuevos inputs
    selectActual[selectActual.length - 1].addEventListener('change', function(){

        eliminaHijos(`${idContenedorInputs}`);

        let listaInputs = tipo == tarjetas.hijos ? generaInputs(this.value, 'hijo') : generaInputs(this.value, 'nieto');

        document.querySelector(`#${idContenedorInputs}`).insertAdjacentHTML('beforeend', listaInputs);

    });

}



//Para saber en qué hijo nos encontramos en la iteración actual:
let indiceHijoActual = 0;
let hijoActual;

function tarjetaNietos(){

    indiceHijoActual = indicesHijosFallecidos[contadorNietos-1];
    hijoActual = getDatosHijos()[indiceHijoActual];


    if(contadorNietos <= indicesHijosFallecidos.length){

        tarjetaHijos(tarjetas.Nieto, hijoActual['Nombre del hijo']);

    }

    //Si ya es la última tarjeta referente a nietos, vamos a los resultados
    if(contadorNietos == indicesHijosFallecidos.length){

        let botonUltimoNieto = document.querySelectorAll('.next-slide');

        botonUltimoNieto[botonUltimoNieto.length-1].addEventListener('click', function(){

            indicesHjosConNietos = hijosConNietos(getDatosHijos());

            tipoConyuge = tarjetas.nietos;

            decideCamino(tarjetas.conyuge);

        });

    }

    contadorNietos++;
    
}

//Obtiene todos los elementos que contengan datos del usuario y los almacena en el objeto datos
function recolectaDatos(tipo){

    let informacion;

    if(tipo == tipoClases.Nieto){

        informacion = document.querySelectorAll(`.${tipo}${indiceHijoActual}`);

    }else{

        informacion = document.querySelectorAll(`.${tipo}`);

    }

    if(tipo == tipoClases.Persona){

        informacion.forEach(element => {

            let atributo = element.dataset.atributo;
            let valor;
            
            //Si no se estableció el nombre de la persona, el valor será "Persona 1"
            if(element.dataset.atributo == 'Nombre persona'){

                if(element.value == ''){

                    valor = element.placeholder;

                    nombrePersona = element.placeholder;

                }else{

                    valor = element.value;

                    nombrePersona = element.value;

                }

            }else{

                valor = element.value;

            }
            
            setDatosPersona(atributo, valor);
            
        });

    }else if(tipo == tipoClases.Hijo){

        //Sobreescribimos los datos ya existentes
        borraHijos();

        let valores = {};


        for (let i = 0; i < informacion.length; i++) {
            
            let atributo = informacion[i].dataset.atributo;

            //Si se trata de un checkbox, verificamos si está checado (true/false). Si no, obtenemos el valor del campo
            let valor = '';

            if(atributo == 'vivo'){

                valor = informacion[i].checked

            }else if(informacion[i].value == ''){

                valor = informacion[i].placeholder;

            }else{

                valor = informacion[i].value;

            }

            valores[atributo] = valor;
            
            if((i + 1) % 2 == 0){

                setDatosHijos(valores);

                valores = {};

            } 
        }

    }else if(tipo == tipoClases.Nieto){

        borraNietos(indiceHijoActual);

        let valores = {};

        for (let i = 0; i < informacion.length; i++) {

            let atributo = informacion[i].dataset.atributo;

            let valor = '';

            if(atributo == 'vivo'){

                valor = informacion[i].checked

            }else if(informacion[i].value == ''){

                valor = informacion[i].placeholder;

            }else{

                valor = informacion[i].value;

            }

            valores[atributo] = valor;
            
            if((i + 1) % 2 == 0){

                setDatosNietos(indiceHijoActual, valores);

                valores = {};

            } 
        }

    }else if(tipo == tipoClases.Ascendientes){

        borraAscendientes();

        let tipoAsc;

        let valores = {};

        for (let i = 0; i < informacion.length; i++) {

            let atributo = informacion[i].dataset.atributo;

            let valor = '';

            if(atributo == 'vivo'){

                valor = informacion[i].checked

            }else if(informacion[i].value == ''){

                valor = informacion[i].placeholder;

            }else{

                valor = informacion[i].value;

            }

            valores[atributo] = valor;
            
            if((i + 1) % 2 == 0){

                valores['tipo'] = informacion[i].dataset.tipo;

                if (valores.vivo) {
                    
                    setDatosAscendientes(valores);

                }

                valores = {};

            } 
        }

    }else if(tipo == tipoClases.Colaterales){

        borraColaterales();

        let tipoAsc;

        let valores = {};

        for (let i = 0; i < informacion.length; i++) {

            let atributo = informacion[i].dataset.atributo;

            let valor = '';

            if(atributo == 'vivo'){

                valor = informacion[i].checked

            }else if(informacion[i].value == ''){

                valor = informacion[i].placeholder;

            }else{

                valor = informacion[i].value;

            }

            valores[atributo] = valor;
            
            if((i + 1) % 2 == 0){

                valores['tipo'] = informacion[i].dataset.tipo;

                if (valores.vivo) {
                    
                    setDatosColaterales(valores);

                }

                valores = {};

            } 
        }

    }
    
}

function cambioRadio(id, elemento){

    let div = document.querySelector('#' + id);

    if(elemento.id == 'Si' || elemento.id == 'si-col'){

        div.classList.remove('d-none');

    }else{

        div.classList.add('d-none');

    }

}

function agregarActive(){

    document.querySelectorAll('.carousel-item').forEach(element => {

        element.classList.remove('active');

    });

    listaTarjetas.lastElementChild.classList.add('active');

}

function encuentraFallecidos(tipo){

    let i = 0;
    let indicesResultado = [];

    let arreglo = tipo;

    arreglo.forEach(element => {

        for (const key in element) {
            
            if(!element[key]){

                indicesResultado.push(i);

            }

        }

        i++;

    });

    return indicesResultado;

}

function encuentraVivos(tipo){

    let i = 0;
    let indicesResultado = [];

    let arreglo = tipo;

    arreglo.forEach(element => {

        for (const key in element) {
            
            if(element[key] === true){

                indicesResultado.push(i);

            }

        }

        i++;

    });

    return indicesResultado;

}

function hijosConNietos(tipo){

    let i = 0;
    let indicesResultado = [];

    let arreglo = tipo;
    let fallecido;

    arreglo.forEach(element => {

        fallecido = false;

        for (const key in element) {
            
            if(!element[key] && element.nietos.length > 0){

                fallecido = true;

            }

            if(fallecido && key == 'nietos'){

                indicesResultado.push(i);

            }

        }

        i++;

    });

    return indicesResultado;

}

function determinaCaso(){

    //Aquí se almacena qué caso resulta
    let element;
    //Estructura del arreglo de hijos
    let hijos = getDatosHijos();

    //Si todos los hijos están vivos
    let hijosVivos = true;

    let validaNietos = true;

    //Obteniendo la lista de hijos vivos
    listaHijosVivos = [...hijos];

    for (let i = 0; i < indicesHijosFallecidos.length; i++) {
        
        delete listaHijosVivos[indicesHijosFallecidos[i]];

    }

    listaHijosVivos = listaHijosVivos.filter(Object);


    listaHijosFallecidos = [...hijos];

    for (let i = 0; i < indicesHijosVivos.length; i++) {
        
        delete listaHijosFallecidos[indicesHijosVivos[i]];

    }

    listaHijosFallecidos = listaHijosFallecidos.filter(Object);

    //Casos para los descendientes
    if(hijos.length > 0){

        //Caso 1: la persona tuvo hijos y se encuentran vivos
        if(hijos.length == listaHijosVivos.length){

            if(!hayConyuge){

                return 'caso 1';

            }else{

                return 'caso 1a'

            }

        }



        //Caso 2: Hay por lo menos un hijo fallecido y no tuvo descendencia
        indicesHijosFallecidos.forEach(element => {

            if(hijos[element].nietos.length != 0){

                validaNietos = false;
        
            }

        });
        //console.log(hijos[indicesHijosFallecidos[0]]);

        //Verificando si los hijos fallecidos tuvieron nietos. De no ser así, nos encontramos ante el caso 2
        if(validaNietos){

            if(!hayConyuge){

                return 'caso 2';

            }else{

                return 'caso 2a'

            }

        }

        if(hijos.length > 0){

            let hayNietos;

            listaHijosFallecidos.forEach(element => {

                if(element.nietos.length > 0){

                    hayNietos = true;

                }

            });

            if(encuentraFallecidos(getDatosHijos()).length != hijos.length){

                if(!hayConyuge){

                    return 'caso 3';
    
                }else{
    
                    return 'caso 3a'
    
                }

            }else{

                if(!hayConyuge){

                    return 'caso 4';
    
                }else{
    
                    return 'caso 4a'
    
                }

            }

        }


    //Casos para los ascendientes y colaterales
    }else{

        //Caso 5: No hay hijos y viven ambos padres
        //Caso 5a: No hay hijos, viven ambos padres y hay cónyuge
        //Caso 6: No hay hijos y vive algún padre
        //Caso 6a: No hay hijos, vive algún padre y hay cónyuge
        let ascendientes = getDatosAscendientes();

        if(ascendientes.length > 0){

            if(ascendientes[0]['tipo'] == 'Padre'){

                if (ascendientes.length == 2) {

                    if(!hayConyuge){

                        return 'caso 5';

                    }else{

                        return 'caso 5a'

                    }

                }else{

                    if(!hayConyuge){

                        return 'caso 6';

                    }else{

                        return 'caso 6a';

                    }

                }


                
            //Caso 7: Se seleccionó abuelos a una línea familiar (paternos O maternos)
            //Caso 7a: Se seleccionó abuelos a una línea familiar (paternos O maternos) y hay cónyuge
            //Caso 8: Se seleccionó abuelos a dos líneas familiares (paternos Y maternos)
            //Caso 8a: Se seleccionó abuelos a dos líneas familiares (paternos Y maternos) y hay cónyuge
            }else if(ascendientes[0]['tipo'] == 'Abuelo Paterno' || ascendientes[0]['tipo'] == 'Abuelo Materno'){

                let contadorPaternos = 0;
                let contadorMaternos = 0;

                ascendientes.forEach(element => {

                    for (const key in element) {
                        
                        if(element[key] == 'Abuelo Paterno'){

                            contadorPaternos++;

                        }else if(element[key] == 'Abuelo Materno'){

                            contadorMaternos++;

                        }

                    }

                });

                if(contadorPaternos == 0 && contadorMaternos > 0 || contadorMaternos == 0 && contadorPaternos > 0){

                    if(!hayConyuge){

                        return 'caso 7';

                    }else{

                        return 'caso 7a';

                    }

                }else if(contadorPaternos > 0 && contadorMaternos > 0){

                    if(!hayConyuge){

                        return 'caso 8';

                    }else{

                        return 'caso 8a';

                    }

                }

            }else{

                let contadorPaternos = 0;
                let contadorMaternos = 0;

                ascendientes.forEach(element => {

                    if(element.tipo == 'Bisabuelo paterno'){
                        
                        contadorPaternos++;

                    }else if(element.tipo == 'Bisabuelo materno'){

                        contadorMaternos++;

                    }

                });

                if(contadorPaternos == 0 && contadorMaternos > 0 || contadorMaternos == 0 && contadorPaternos > 0){
                    
                    if(!hayConyuge){

                        return 'caso 9';

                    }else{

                        return 'caso 9a';

                    }

                }else if(contadorPaternos > 0 && contadorMaternos > 0){

                    if(!hayConyuge){

                        return 'caso 10';

                    }else{

                        return 'caso 10a';

                    }

                }

            }

        //Colaterales
        }else{

            if(tipoColateral == 'Hermano'){

                if(!hayConyuge){

                    return 'caso 11';

                }else{

                    return 'caso 11a';

                }

            }else if(tipoColateral == 'Tío (hermano)'){

                if(!hayConyuge){

                    return 'caso 12';

                }else{

                    return 'caso 12a';

                }

            }else if(tipoColateral == 'Primo (hermano)'){

                if(!hayConyuge){

                    return 'caso 13';

                }else{

                    return 'caso 13a';

                }

            }

        }

    }

}
/*
Clases que guardan información de las personas:
dato-Persona
dato-Hijos
*/
function tarjetaAscDesc(tipo){

    let tarjeta = document.createElement('div');
    
    tarjeta.classList.add('carousel-item', 'tarjeta');

    let contenido = document.createElement('div');
    contenido.id = 'divContenedor';
    contenido.classList.add('contenido');

    tarjeta.appendChild(contenido);

    //Creando las indicaciones

    let textoPregunta = '';

    if(fechaFallecimientoOriginal.value == ''){

        textoPregunta += `¿Al día de hoy ${getDatos()['Nombre persona']} tiene algún pariente ascendente vivo?`;

    }else{

        textoPregunta += `¿Al día de <strong>${formatoFecha(fechaFallecimientoOriginal.value)}</strong> ${getDatos()['Nombre persona']} tenía algún pariente ascendente vivo?`;

    }

    
    let textoIndicaciones = 'Seleccione el pariente ascendente vivo más cercano:'

    let idSelect = tipo == tarjetas.Ascendientes ? 'select-ascendientes' : 'select-descendientes';

    let divPregunta = `

        <div>

            <p class="text-left">${textoPregunta}</p>
            <div class="mt-4">
                <input type="radio" id="Si" name="pariente" checked>
                <label for="Si">Sí</label><br>
                <input type="radio" id="No" name="pariente">
                <label for="No">No</label><br>
            </div>

            <div class="mt-5 mx-auto" id="div-${idSelect}">

                <div class="dos-elementos mb-5">
                    <p class="mx-auto">${textoIndicaciones}</p>

                    <select class="align-self-center mx-auto" id="${idSelect}">

                        <option selected="true" disabled="disabled">Seleccione una opción</option>
                        <option>Padres</option>
                        <option>Abuelos</option>
                        <option>Bisabuelos</option>
                    
                    </select>

                </div>

            </div>

        </div>

    `;

    contenido.insertAdjacentHTML('beforeend', muestraModalAyuda(tarjetas.ascendientes));

    contenido.insertAdjacentHTML('beforeend', divPregunta);

    listaTarjetas.appendChild(tarjeta);

    let eleccionRadioSi = document.querySelector('#Si');
    let eleccionRadioNo = document.querySelector('#No');

    eleccionRadioSi.addEventListener('change', () => cambioRadio('div-' + idSelect, eleccionRadioSi));
    eleccionRadioNo.addEventListener('change', () => cambioRadio('div-' + idSelect, eleccionRadioNo));

    let selectAscDesc = document.querySelector(`#${idSelect}`);

    let divContenedor = document.querySelector('#divContenedor');
    let btn = botonSiguiente();
    divContenedor.insertAdjacentHTML('beforeend', btn);

    let btnSiguiente = document.querySelectorAll('.btn-siguiente');

    btnSiguiente[btnSiguiente.length-1].addEventListener('click', function(){

        if(document.querySelector('#Si').checked){

            //Tiene que haber una opción seleccionada para avanzar
            if(selectAscDesc.value != 'Seleccione una opción'){

                recolectaDatos(tipoClases.Ascendientes);

                //Se deben proporcionar los datos de por lo menos un familiar para avanzar
                if(getDatosAscendientes().length > 0){

                    tipoConyuge = tarjetas.ascendientes;

                    decideCamino(tarjetas.conyuge); 

                }else{

                    alert('Debes ingresar los datos de por lo menos un familiar vivo para continuar');

                }
                
            }else{

                alert('Debes seleccionar una opción para continuar');

            }

        }else{

            decideCamino(tarjetas.colaterales);

        }

        

    });

    selectAscDesc.addEventListener('change', function(){

        if(document.querySelectorAll('.papas')[0]){

            eliminaDiv('inputsAscDesc');

        }

        let inputs = generaInputsAscDesc(tipo, selectAscDesc.value);

        let divInputs = document.querySelector('#div-select-ascendientes');

        divInputs.insertAdjacentHTML('beforeend', inputs);

    });


    listaTarjetas.lastElementChild.previousSibling.classList.remove('active');
    listaTarjetas.lastElementChild.classList.add('active');

}

function generaInputsAscDesc(tipo, opcion){

    let plantilla = '';

    if(tipo == tarjetas.Ascendientes){

        plantilla = `

                <div class="papas" id="inputsAscDesc">
                    <p>Ingresa los nombres:</p>

        `;

        if(fechaFallecimientoOriginal.value == ''){

            plantilla += `<p class="text-center">Al día de hoy está vivo</p>`;

        }else{

            plantilla += `<p class="text-center">Al día de <strong>${formatoFecha(fechaFallecimientoOriginal.value)}</strong> estaba vivo</p>`;

        }

        switch (opcion) {

            case 'Padres':
                
                plantilla += `

                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Papá" data-atributo="Nombre padre" data-tipo="Padre">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Padre">

                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Mamá" data-atributo="Nombre madre" data-tipo="Padre">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Padre">

                    </div>
                `;

                break;

            case 'Abuelos':

                plantilla += `

                        <p class="label-abuelos">Abuelos Paternos</p>
                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Abuelo paterno" data-atributo="Nombre abuelo" data-tipo="Abuelo Paterno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Abuelo Paterno">

                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Abuela paterna" data-atributo="Nombre abuelo" data-tipo="Abuelo Paterno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Abuelo Paterno">


                        <p class="label-abuelos mt-2">Abuelos Maternos</p>
                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Abuelo materno" data-atributo="Nombre abuelo" data-tipo="Abuelo Materno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Abuelo Materno">

                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Abuela materna" data-atributo="Nombre abuelo" data-tipo="Abuelo Materno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Abuelo Materno">

                    </div>
                `;
            
                break;

            case 'Bisabuelos':
        
                plantilla += `

                        <p class="label-abuelos">Bisabuelos por parte del abuelo paterno</p>
                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Bisabuelo" data-atributo="Nombre bisabuelo" data-tipo="Bisabuelo paterno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Bisabuelo paterno">

                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Bisabuela" data-atributo="Nombre bisabuelo" data-tipo="Bisabuelo paterno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Bisabuelo paterno">


                        <p class="label-abuelos mt-2">Bisabuelos por parte de la abuela paterna</p>
                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Bisabuelo" data-atributo="Nombre bisabuelo" data-tipo="Bisabuelo paterno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Bisabuelo paterno">

                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Bisabuela" data-atributo="Nombre bisabuelo" data-tipo="Bisabuelo paterno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Bisabuelo paterno"><br>
                        


                        <p class="label-abuelos">Bisabuelos por parte del abuelo materno</p>
                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Bisabuelo" data-atributo="Nombre bisabuelo" data-tipo="Bisabuelo materno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Bisabuelo materno">

                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Bisabuela" data-atributo="Nombre bisabuelo" data-tipo="Bisabuelo materno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Bisabuelo materno">


                        <p class="label-abuelos mt-2">Bisabuelos por parte de la abuela materna</p>
                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Bisabuelo" data-atributo="Nombre bisabuelo" data-tipo="Bisabuelo materno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Bisabuelo materno">

                        <input type="text" class="${tipoClases.Ascendientes} ml-auto" placeholder="Bisabuela" data-atributo="Nombre bisabuelo" data-tipo="Bisabuelo materno">
                        <input type="checkbox" class="${tipoClases.Ascendientes} align-self-center mx-auto" value="" data-atributo="vivo" data-tipo="Bisabuelo materno">

                    </div>
                `;

                break;
        
            default:
                break;
        }

    }else if(tipo == tarjetas.colaterales){

        if (opcion == 0) {
            
            plantilla = '';

        }else{

            plantilla += `
        
                <div class="dos-elementos text-center mt-5">

                    <div>
                        <p>Ingresa los nombres</p>
                    </div>

                    <div>
                        <p>Al día de hoy está vivo</p>
                    </div>

            `;

        }

        
        for (let i = 0; i < opcion; i++) {
            
            plantilla += `
            
                <div>
                    <input type="text" id="input-nombre" data-atributo="Nombre del colateral" class="barra-texto align-self-center mx-auto ${tipoClases.Colaterales} text-capitalize" placeholder="Colateral ${i+1}">
                </div>
                <div class="align-self-center">
                    <input type="checkbox" id="input-check" class="${tipoClases.Colaterales}" value="" data-atributo="vivo">
                </div>

            `;
            
        }

        plantilla += '</div>'

    }

    return plantilla;
}



function eliminaDiv(id){

    let elemento = document.querySelector(`#${id}`);

    elemento.remove();

}


function tarjetaColaterales(){

    let tarjeta = document.createElement('div');
    
    tarjeta.classList.add('carousel-item', 'tarjeta');

    let contenido = document.createElement('div');
    contenido.id = 'divContenedorColateral';
    contenido.classList.add('contenido');

    tarjeta.appendChild(contenido);

    //Creando las indicaciones

    let textoPregunta = '';

    if(fechaFallecimientoOriginal.value == ''){

        textoPregunta += `¿Al día de hoy ${getDatos()['Nombre persona']} tiene algún pariente colateral vivo?`;

    }else{

        textoPregunta += `¿Al día de <strong>${formatoFecha(fechaFallecimientoOriginal.value)}</strong> ${getDatos()['Nombre persona']} tenía algún pariente colateral vivo?`;

    }

    
    let textoIndicaciones = 'Seleccione el pariente colateral vivo más cercano:'

    let idSelect = 'select-colaterales';

    let divPregunta = `

        <div>

            <p class="text-left">${textoPregunta}</p>
            <div class="mt-4">
                <input type="radio" id="si-col" name="pariente" checked>
                <label for="Si">Sí</label><br>
                <input type="radio" id="no-col" name="pariente">
                <label for="No">No</label><br>
            </div>

            <div class="mt-5 mx-auto" id="div-${idSelect}">

                <div class="dos-elementos mb-5" id="borrar-colaterales">
                    <p class="mx-auto">${textoIndicaciones}</p>

                    <select class="align-self-center mx-auto" id="${idSelect}">

                        <option selected="true" disabled="disabled">Seleccione una opción</option>
                        <option>Hermano</option>
                        <option>Tío (hermano)</option>
                        <option>Primo (hermano)</option>
                    
                    </select>

                </div>

                <div id="contenedor">

                </div>

            </div>

        </div>

    `;

    contenido.insertAdjacentHTML('beforeend', muestraModalAyuda(tarjetas.colaterales));

    contenido.insertAdjacentHTML('beforeend', divPregunta);

    listaTarjetas.appendChild(tarjeta);

    let eleccionRadioSi = document.querySelector('#si-col');
    let eleccionRadioNo = document.querySelector('#no-col');

    eleccionRadioSi.addEventListener('change', () => cambioRadio('div-' + idSelect, eleccionRadioSi));
    eleccionRadioNo.addEventListener('change', () => cambioRadio('div-' + idSelect, eleccionRadioNo));

    let selectColateral = document.querySelector(`#${idSelect}`);

    let divContenedor = document.querySelector('#divContenedorColateral');
    let btn = botonSiguiente();
    divContenedor.insertAdjacentHTML('beforeend', btn);

    let btnSiguiente = document.querySelectorAll('.btn-siguiente');

    btnSiguiente[btnSiguiente.length-1].addEventListener('click', function(){

        //Tiene que haber una opción seleccionada para avanzar
        if(selectColateral.value != 'Seleccione una opción'){

            recolectaDatos(tipoClases.Colaterales);

            console.log(getDatosColaterales());

            //Se deben proporcionar los datos de por lo menos un familiar para avanzar
            if(getDatosColaterales().length > 0){

                tipoConyuge = tarjetas.colaterales;

                decideCamino(tarjetas.conyuge);  

            }else{

                alert('Debes ingresar los datos de por lo menos un familiar vivo para continuar');

            }
            
        }else{

            alert('Debes seleccionar una opción para continuar');

        }

    });

    selectColateral.addEventListener('change', function(){

        let plantillaColaterales = generaColaterales(selectColateral.value, getDatos()['Nombre persona']);

        let contenedorColaterales = document.querySelector('#contenedor');

        eliminaHijos('contenedor');

        contenedorColaterales.insertAdjacentHTML('beforeend', plantillaColaterales);

        let select = document.querySelectorAll('.numero-colaterales');

        llenaSelect(select, 20);

        tipoColateral = this.value;

        select[select.length - 1].addEventListener('click', function () {
            
            console.log(this.value);

            if(contenedorColaterales.childElementCount > 1){

                contenedorColaterales.removeChild(contenedorColaterales.lastElementChild);

            }

            let inputs = generaInputsAscDesc(tarjetas.colaterales, this.value);

            contenedorColaterales.insertAdjacentHTML('beforeend', inputs);

        });
      
    });


    listaTarjetas.lastElementChild.previousSibling.classList.remove('active');
    listaTarjetas.lastElementChild.classList.add('active');

}

function generaColaterales(tipo, nombre) {

    let plantilla = '';

    switch (tipo) {

        case 'Hermano':

            plantilla = `
    
                <div class="label-input mx-auto">
                    <p>¿Cuántos hermanos tuvo ${nombre}?</p>
                    <select class="select-colaterales numero-colaterales"></select>
                </div>

            `;
            break;
        case 'Tío (hermano)':

            plantilla = `
    
            <div class="label-input mx-auto">
                <p>¿Cuántos tíos hermanos tuvo ${nombre}?</p>
                <select class="select-colaterales numero-colaterales"></select>
            </div>

        `;
            break;

        case 'Primo (hermano)':

            plantilla = `
    
            <div class="label-input mx-auto">
                <p>¿Cuántos primos hermanos tuvo ${nombre}?</p>
                <select class="select-hijos numero-colaterales"></select>
            </div>

        `;
            break;
    }
    
    return plantilla;

}

function tarjetaConyuge(tipo){

    let texto = '';

    if(fechaFallecimientoOriginal.value == ''){

        texto += `¿Al día de hoy ${getDatos()['Nombre persona']} tiene cónyuge?`;

    }else{

        texto += `¿Al día de <strong>${formatoFecha(fechaFallecimientoOriginal.value)}</strong> ${getDatos()['Nombre persona']} tuvo cónyuge?`;

    }

    listaTarjetas.lastElementChild.classList.remove('active');

    tarjetaSiNo(texto, tarjetas.conyuge);

    //if(tipo == tarjetas.ascendientes || tipo == tarjetas.colaterales){

        document.querySelector('#si-conyuge').addEventListener('click', () => {
           
            hayConyuge = true;

            if (tipo == tarjetas.hijos || tipo == tarjetas.nietos) {

                texto = '¿La/el cónyuge carece de bienes?';

                listaTarjetas.lastElementChild.classList.remove('active');
                
                tarjetaSiNo(texto, tarjetas.nietos);

                listaTarjetas.lastElementChild.classList.add('active');

            }else{

                determinaCaso();

                decideCamino(tarjetas.resultado);

            }

        });

        document.querySelector('#no-conyuge').addEventListener('click', () => {
            
            determinaCaso();

            decideCamino(tarjetas.resultado);

        });

   // }

    listaTarjetas.lastElementChild.classList.add('active');

}

function tarjetaExplicacion() {

    let tarjeta = document.createElement('div');
    tarjeta.classList.add('carousel-item', 'tarjeta');

    let contenido = document.createElement('div');
    contenido.classList.add('contenido');

    let btn = botonSiguiente();

    let texto = `

        <div class="explicacion">

            <p>Antes de realizar la repartición de los bienes a los herederos, se le deberá proporcionar a el/la cónyuge la parte correspondiente para igualar la parte de uno de los hijos, posteriormente la herencia sobrante se dividirá de la siguiente manera:'</p>

            ${btn}

        </div>

    `;

    contenido.insertAdjacentHTML('beforeend', texto);

    tarjeta.appendChild(contenido);

    listaTarjetas.appendChild(tarjeta);

    let btnSiguiente = document.querySelectorAll('.btn-siguiente');

    btnSiguiente[btnSiguiente.length - 1].addEventListener('click', () => {

        hayConyuge = false;

        determinaCaso();

        decideCamino(tarjetas.resultado);

    });

}

function muestraModalAyuda(tipo){

    let listener = `

        <div class="btn-ayuda" data-bs-toggle="modal" data-bs-target="#ayuda">

            <i class="fa-regular fa-circle-question fa-xl mx-auto"></i>

            <p class="text-center">Ayuda</p>

        </div>
        
    `;

    if(tipo == tarjetas.ascendientes){

        document.querySelector('#texto-ayuda').innerText = 'La familia ascendiente son los padres, madres, abuelos y bisabuelos';

    }else if(tipo == tarjetas.colaterales){

        document.querySelector('#texto-ayuda').innerText = `La familia colateral son los hermanos, primos y tíos.\n En este caso únicamente se considera que tiene derecho a “heredar” la familia colateral hasta 4° grado, es decir: los hermanos, tíos (hermanos de padres) y sobrinos-hermanos (hijos de los hermanos de los padres).`;

    }else if(tipo == tarjetas.conyuge){

        document.querySelector('#texto-ayuda').innerText = 'Los cónyuges son los esposos y esposas.\nAsí como los concubinos y concubinas, cuando la relación dura hasta la muerte de uno de ellos.';

    }else{

        document.querySelector('#texto-ayuda').innerText = 'Si la pareja estuvo casada por sociedad conyugal (compartían bienes) entonces puede contestar que “no”; pues se considera que los bienes que hicieron en común se dividen en partes iguales.';

    }

    return listener;

}