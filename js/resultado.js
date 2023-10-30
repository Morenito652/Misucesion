//Estructura con los datos recolectados en el programa
let jsonResultados = JSON.parse(sessionStorage.getItem("datos"));

console.log(jsonResultados);

//Estructura con los hijos vivos
let hijosVivos = JSON.parse(sessionStorage.getItem("hijosVivos"));
//Estructura con los hijos fallecidos
let hijosFallecidos = JSON.parse(sessionStorage.getItem("hijosFallecidos"));

//Indices hijos vivos
let indicesHijosVivos = JSON.parse(sessionStorage.getItem("indicesHijosVivos"));
//Indices hijos vivos
let indicesHijosFallecidos = JSON.parse(sessionStorage.getItem("indicesHijosFallecidos"));

let indicesHijosConNietos = JSON.parse(sessionStorage.getItem("indicesHijosConNietos"));

//Caso actual de la herencia
let caso = sessionStorage.getItem("caso");

console.log(caso);

//Plantilla que contiene los resultados
let template = ``;

//Texto que se mosrará en el pdf y se enviará por correo
let plantilla = '\n\n';

muestraResultados();

function muestraResultados(){

    let templateResultados = calculaResultado();

    let contenedorResultados = document.querySelector('#contenedor-resultados');

    contenedorResultados.insertAdjacentHTML('beforeend', templateResultados)

    
}

function calculaResultado(){

    borraHijosSinNietos();

    let hijos = jsonResultados.hijos;
    let ascendientes = jsonResultados.ascendientes;
    let colaterales = jsonResultados.colaterales;

    let porcentaje;

    switch(caso){

        case 'caso 1':

            hijos.forEach(element => {
                
                porcentaje = 100 / hijos.length;
                const nombreHijo = element['Nombre del hijo'];

                template += `

                        <p>${nombreHijo}</p>
                        <p>=</p>
                        <p>${porcentaje.toFixed(2)}%</p>
    
                `;

            });

            return template;

        case 'caso 1a':

            porcentaje = 100 / (hijos.length + 1);  

            template += `

                <p>Cónyuge</p>
                <p>=</p>
                <p>${porcentaje.toFixed(2)}%</p>

            `;

            hijos.forEach(element => {

                const nombreHijo = element['Nombre del hijo'];

                template += `

                        <p>${nombreHijo}</p>
                        <p>=</p>
                        <p>${porcentaje.toFixed(2)}%</p>
    
                `;

            });

            return template;
            
        case 'caso 2':

            porcentaje = 100 / hijosVivos.length;

            hijosVivos.forEach(element => {
                    
                const nombreHijo = element['Nombre del hijo'];

                template += `

                        <p>${nombreHijo}</p>
                        <p>=</p>
                        <p>${porcentaje.toFixed(2)}%</p>
    
                `;

            });
            
            return template;

        case 'caso 2a':

            porcentaje = 100 / (hijosVivos.length + 1);

            hijosVivos.forEach(element => {
                    
                const nombreHijo = element['Nombre del hijo'];

                template += `

                        <p>${nombreHijo}</p>
                        <p>=</p>
                        <p>${porcentaje.toFixed(2)}%</p>
    
                `;

            });
            
            return template;

        //Caso 3 y caso 4 se resuelven con la misma lógica
        case 'caso 4':
        case 'caso 3':
            
            let porcentajeHijos = 100 / (hijosVivos.length + indicesHijosConNietos.length);
            let hayNietos = false;
            let listaNietos = {};

            hijos.forEach(element => {
                
                const nombreHijo = element['Nombre del hijo'];

                for (const key in element) {
                    
                    if(key == 'nietos' && element.nietos.length > 0){

                        hayNietos = true

                        listaNietos = element[key];

                    }else{

                        hayNietos = false;

                    }

                }

                if (hayNietos) {
                    
                    console.log(element);

                    let listaNietosVivos = [...element.nietos];
                    let indicesNietosFallecidos = encuentraFallecidos(element.nietos);

                    for (let i = 0; i < indicesNietosFallecidos.length; i++) {
                        
                        delete listaNietosVivos[indicesNietosFallecidos[i]];
                
                    }
                
                    listaNietosVivos = listaNietosVivos.filter(Object);

                    const porcentajeNietos = porcentajeHijos / listaNietosVivos.length;

                    listaNietosVivos.forEach(nieto => {

                        let nombreNieto = nieto['Nombre del nieto'];
                        
                        template += `

                                <p>${nombreNieto}</p>
                                <p>=</p>
                                <p>${porcentajeNietos.toFixed(2)}%</p>
            
                        `;

                    });

                }else{

                    template += `

                            <p>${nombreHijo}</p>
                            <p>=</p>
                            <p>${porcentajeHijos.toFixed(2)}%</p>
        
                    `;

                }

            });

            return template;

            case 'caso 4a':
            case 'caso 3a':

                let porcentajeHijosa = 100 / ((hijosVivos.length + indicesHijosConNietos.length) + 1);
                let hayNietosa = false;
                let listaNietosa = {};

                template += `

                    <p>Cónyuge</p>
                    <p>=</p>
                    <p>${porcentajeHijosa.toFixed(2)}%</p>

                `;
    
                hijos.forEach(element => {
                    
                    const nombreHijo = element['Nombre del hijo'];
    
                    for (const key in element) {
                        
                        if(key == 'nietos' && element.nietos.length > 0){
    
                            hayNietosa = true
    
                            listaNietosa = element[key];
    
                        }else{
    
                            hayNietosa = false;
    
                        }
    
                    }
    
                    if (hayNietosa) {
                        
                        console.log(element);
    
                        let listaNietosVivos = [...element.nietos];
                        let indicesNietosFallecidos = encuentraFallecidos(element.nietos);
    
                        for (let i = 0; i < indicesNietosFallecidos.length; i++) {
                            
                            delete listaNietosVivos[indicesNietosFallecidos[i]];
                    
                        }
                    
                        listaNietosVivos = listaNietosVivos.filter(Object);
    
                        const porcentajeNietos = porcentajeHijosa / listaNietosVivos.length;
    
                        listaNietosVivos.forEach(nieto => {
    
                            let nombreNieto = nieto['Nombre del nieto'];
                            
                            template += `
    
                                    <p>${nombreNieto}</p>
                                    <p>=</p>
                                    <p>${porcentajeNietos.toFixed(2)}%</p>
                
                            `;
    
                        });
    
                    }else{
    
                        template += `
    
                                <p>${nombreHijo}</p>
                                <p>=</p>
                                <p>${porcentajeHijosa.toFixed(2)}%</p>
            
                        `;
    
                    }
    
                });
    
                return template;

        case 'caso 5':
                
            porcentaje = 100 / 2;

            const nombrePadre = ascendientes[0]['Nombre padre'];
            const nombreMadre = ascendientes[1]['Nombre madre'];

            template += `

                    <p>${nombrePadre}</p>
                    <p>=</p>
                    <p>${porcentaje.toFixed(2)}%</p>

                    <p>${nombreMadre}</p>
                    <p>=</p>
                    <p>${porcentaje.toFixed(2)}%</p>

            `;

            return template;

        case 'caso 5a':

            porcentaje = 50 / 2;

            template += `

                <p>Cónyuge</p>
                <p>=</p>
                <p>50%</p>

            `;

            const nombrePadrea = ascendientes[0]['Nombre padre'];
            const nombreMadrea= ascendientes[1]['Nombre madre'];

            template += `

                    <p>${nombrePadrea}</p>
                    <p>=</p>
                    <p>${porcentaje.toFixed(2)}%</p>

                    <p>${nombreMadrea}</p>
                    <p>=</p>
                    <p>${porcentaje.toFixed(2)}%</p>

            `;

            return template;

        case 'caso 6':

            porcentaje = 100;

            for (let i = 0; i < ascendientes.length; i++) {

                if(ascendientes[i].vivo == true){

                    console.log(i);

                    console.log(ascendientes);

                    let nombre = ascendientes[i]['Nombre padre'] || ascendientes[i]['Nombre madre'];

                    template += `
                    
                        <p>${nombre}</p>
                        <p>=</p>
                        <p>${porcentaje.toFixed(2)}%</p>
                    
                    `;

                }

            }

            return template;
        
        case 'caso 6a':
        
            porcentaje = 50;

            template += `

                <p>Cónyuge</p>
                <p>=</p>
                <p>50%</p>

            `;

            for (let i = 0; i < ascendientes.length; i++) {

                if(ascendientes[i].vivo == true){

                    let nombre = ascendientes[i]['Nombre padre'] || ascendientes[i]['Nombre madre'];

                    template += `
                    
                        <p>${nombre}</p>
                        <p>=</p>
                        <p>${porcentaje.toFixed(2)}%</p>
                    
                    `;

                }

            }

            return template;

        case 'caso 7':

            porcentaje = 100 / ascendientes.length;

            ascendientes.forEach(element => {

                template += `
                    
                    <p>${element['Nombre abuelo']}</p>
                    <p>=</p>
                    <p>${porcentaje.toFixed(2)}%</p>
                
                `;

            });

            return template;

        case 'caso 7a':
    
            porcentaje = 50 / ascendientes.length;

            template += `

                <p>Cónyuge</p>
                <p>=</p>
                <p>50%</p>

            `;

            ascendientes.forEach(element => {

                template += `
                    
                    <p>${element['Nombre abuelo']}</p>
                    <p>=</p>
                    <p>${porcentaje.toFixed(2)}%</p>
                
                `;

            });

            return template;

        case 'caso 8':

            let numeroAbuelosPaternos = 0, numeroAbuelosMaternos = 0;

            ascendientes.forEach(element => {

                if(element.tipo == 'Abuelo Paterno'){

                    numeroAbuelosPaternos++;

                }else{

                    numeroAbuelosMaternos++;

                }

            });

            let porcentajeAbuelosPaternos = 50 / numeroAbuelosPaternos;
            let porcentajeAbuelosMaternos = 50 / numeroAbuelosMaternos;

            ascendientes.forEach(element => {

                if(element.tipo == 'Abuelo Paterno'){

                    template += `
                    
                        <p>${element['Nombre abuelo']}</p>
                        <p>=</p>
                        <p>${porcentajeAbuelosPaternos.toFixed(2)}%</p>
                    
                    `;

                }else{

                    template += `
                    
                        <p>${element['Nombre abuelo']}</p>
                        <p>=</p>
                        <p>${porcentajeAbuelosMaternos.toFixed(2)}%</p>
                    
                    `;

                }

            });

            return template;

        case 'caso 8a':

            let numeroAbuelosPaternosa = 0, numeroAbuelosMaternosa = 0;

            template += `

                <p>Cónyuge</p>
                <p>=</p>
                <p>50%</p>

            `;

            ascendientes.forEach(element => {

                if(element.tipo == 'Abuelo Paterno'){

                    numeroAbuelosPaternosa++;

                }else{

                    numeroAbuelosMaternosa++;

                }

            });

            let porcentajeAbuelosPaternosa = 25 / numeroAbuelosPaternosa;
            let porcentajeAbuelosMaternosa = 25 / numeroAbuelosMaternosa;

            ascendientes.forEach(element => {

                if(element.tipo == 'Abuelo Paterno'){

                    template += `
                    
                        <p>${element['Nombre abuelo']}</p>
                        <p>=</p>
                        <p>${porcentajeAbuelosPaternosa.toFixed(2)}%</p>
                    
                    `;

                }else{

                    template += `
                    
                        <p>${element['Nombre abuelo']}</p>
                        <p>=</p>
                        <p>${porcentajeAbuelosMaternosa.toFixed(2)}%</p>
                    
                    `;

                }

            });

            return template;

        case 'caso 9':

            porcentaje = 100 / ascendientes.length;

            ascendientes.forEach(element => {

                template += `
                    
                    <p>${element['Nombre bisabuelo']}</p>
                    <p>=</p>
                    <p>${porcentaje.toFixed(2)}%</p>
                
                `;

            });

            return template;

        case 'caso 9a':

            template += `

                <p>Cónyuge</p>
                <p>=</p>
                <p>50%</p>

            `;

            porcentaje = 50 / ascendientes.length;

            ascendientes.forEach(element => {

                template += `
                    
                    <p>${element['Nombre bisabuelo']}</p>
                    <p>=</p>
                    <p>${porcentaje.toFixed(2)}%</p>
                
                `;

            });

            return template;

        case 'caso 10':
            
            let numeroBisabuelosPaternos = 0, numeroBisabuelosMaternos = 0;

            ascendientes.forEach(element => {

                if(element.tipo == 'Bisabuelo paterno'){

                    numeroBisabuelosPaternos++;

                }else{

                    numeroBisabuelosMaternos++;

                }

            });

            let porcentajeBisabuelosPaternos = 50 / numeroBisabuelosPaternos;
            let porcentajeBisabuelosMaternos = 50 / numeroBisabuelosMaternos;

            ascendientes.forEach(element => {

                if(element.tipo == 'Bisabuelo paterno'){

                    template += `
                    
                        <p>${element['Nombre bisabuelo']}</p>
                        <p>=</p>
                        <p>${porcentajeBisabuelosPaternos.toFixed(2)}%</p>
                    
                    `;

                }else{

                    template += `
                    
                        <p>${element['Nombre bisabuelo']}</p>
                        <p>=</p>
                        <p>${porcentajeBisabuelosMaternos.toFixed(2)}%</p>
                    
                    `;

                }

            });

            return template;

        case 'caso 10a':

            let numeroBisabuelosPaternosa = 0, numeroBisabuelosMaternosa = 0;

            template += `

                <p>Cónyuge</p>
                <p>=</p>
                <p>50%</p>

            `;

            ascendientes.forEach(element => {

                if(element.tipo == 'Bisabuelo paterno'){

                    numeroBisabuelosPaternosa++;

                }else{

                    numeroBisabuelosMaternosa++;

                }

            });

            let porcentajeBisabuelosPaternosa = 25 / numeroBisabuelosPaternosa;
            let porcentajeBisabuelosMaternosa = 25 / numeroBisabuelosMaternosa;

            ascendientes.forEach(element => {

                if(element.tipo == 'Bisabuelo paterno'){

                    template += `
                    
                        <p>${element['Nombre bisabuelo']}</p>
                        <p>=</p>
                        <p>${porcentajeBisabuelosPaternosa.toFixed(2)}%</p>
                    
                    `;

                }else{

                    template += `
                    
                        <p>${element['Nombre bisabuelo']}</p>
                        <p>=</p>
                        <p>${porcentajeBisabuelosMaternosa.toFixed(2)}%</p>
                    
                    `;

                }

            });

            return template;

        case 'caso 11':
        case 'caso 12':
        case 'caso 13':

            console.log(colaterales);

            porcentaje = 100 / colaterales.length;

            colaterales.forEach(element => {
                    
                const nombreColateral = element['Nombre del colateral'];

                template += `

                        <p>${nombreColateral}</p>
                        <p>=</p>
                        <p>${porcentaje.toFixed(2)}%</p>
    
                `;

            });

            return template;

        case 'caso 11a':
        case 'caso 12a':
        case 'caso 13a': 
            
            console.log(colaterales);

            porcentaje = 33 / colaterales.length;

            template += `

                <p>Cónyuge</p>
                <p>=</p>
                <p>67%</p>

            `;

            colaterales.forEach(element => {
                    
                const nombreColateral = element['Nombre del colateral'];

                template += `

                        <p>${nombreColateral}</p>
                        <p>=</p>
                        <p>${porcentaje.toFixed(2)}%</p>

                `;

            });

            return template;

    }

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

function borraHijosSinNietos(){

    let hijos = [...hijosFallecidos];

    for (let i = 0; i < indicesHijosFallecidos.length; i++) {

        if (hijos[i].nietos.length == 0) {

            delete jsonResultados.hijos[indicesHijosFallecidos[i]];

        }
                        
    }

    jsonResultados.hijos = jsonResultados.hijos.filter(Object);

}

document.querySelector('#generar-pdf').addEventListener('click', function() {
    
    let texto = [];

    const doc = new jsPDF();
    
    let logoData = 'data:image/jpeg;base64,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'

    
    doc.addImage(logoData, 20, 10, 25, 35);

    let parrafos = document.getElementsByTagName('p');

    for (const iterator of parrafos) {
        
        texto.push(iterator.innerText);

    }

    //Los dos primeros párrafos no se deben tomar en cuenta
    texto.shift();texto.shift();texto.shift();

    for (let i = 0; i < texto.length; i++) {
        
        plantilla += texto[i] + '   ';

        //Cada tres elementos agregamos un salto de línea
        if((i+1) != 0 && (i+1) % 3 == 0){

            plantilla += '\n';

        }
        
    }

    doc.text('Los resultados de la herencia son los siguientes:', 20, 70);

    doc.text(plantilla, 20, 70);

    doc.save("resultados.pdf");

});
