import { Medallero } from "./medallas/medallero.js";
import { Modal } from "./modal.js";

var contadorCorrectas = 0, contadorIncorrectas = 0, totalPreguntas = 0;
let modalApi = '', loader = '', contenedor = '', titulo = '',imagenesPrecargadas = '';

window.onload = ()=> {

    modalApi= new Modal('modalTrivia');
    
    titulo = document.querySelector('.titulo');
    contenedor = document.getElementById('contenedor');
    loader = document.getElementById('loader');

    //En caso de si hubiera ocurrido un error de carga de json
    loader.classList.remove('hide');   
    
    contenedor.classList.add('hide');
    
    // Preload de imágenes
    imagenesPrecargadas = precargarImagenes();
    cargarJson();

    // Testing Modal
    // const medallero = new Medallero(0, 2, 5, imagenesPrecargadas);
    // modalApi.actualizarContenidoModal(medallero);
    // modalApi.mostrarModal();    
}

function precargarImagenes() {

    //TODO: Refactorizar con promesas. Errores en la carga de imágenes o recursos son asíncronos
    //o sea no se pueden capturar con Try catch. Usar promesas

    try {
       
        const imagenes = {
        oro: "img/medallaOro.jpg",
        plata: "img/medallaPlata.jpg",
        bronce: "img/medallaBronce.jpg",
        consuelo: "img/medallaConsuelo.jpg"
        }

        // Iterar sobre el objeto y crea un objeto de tipo Image
        Object.values(imagenes).forEach(src =>{
                
            const img = new Image();
            // Al asginar la propiedad src, se hace una pretición HTTP y la imágen
            // queda en caché.
            img.src = src;
        });

        return imagenes;
        
    } catch (error) {        
        mostrarError(error);
    }    
}

export function cargarJson(){

    fetch('https://AndresFor78.github.io/desarrollo/resources/triviaSurVacaciones.json', {cache: 'no-store'})
    // fetch('https://AndresFor78.github.io/desarrollo/resources/triviaSurCopy.json', {cache: 'no-store'})
    // fetch('./resources/triviaSurCopy.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Se ha producido un error al cargar el recurso");            
        }
        return response.json();        
    }).then(data =>{
        setTimeout(() => {
            crearTrivia(data);
            loader.classList.add('hide');
            contenedor.classList.remove('hide');
        }, 0);
    }).catch(e=>{
        console.log(e);   
        mostrarError(e);     
    })
}

function crearTrivia(jsonPreguntas){

    limpiarHTML(); 

    const preguntas = barajar(jsonPreguntas);

    // Crea título trivia
    let h3 = document.createElement('h3');
    h3.textContent = `¡Demuestra que conoces el sur de Chile
                      contestando las ${preguntas.length} preguntas y
                      obtén tu medalla! `;
    titulo.appendChild(h3);

    const ul = document.createElement('ul');
    let liPrincipal, liAlternativa, p, ol, div = '';

    preguntas.forEach((pregunta, index) =>{
        // Crea li
        liPrincipal = document.createElement('li');
        liPrincipal.dataset.numeroPregunta = pregunta.idPregunta;
        p = document.createElement('p');
        p.textContent = `${index + 1}.- ${pregunta.nombrePregunta}`
        liPrincipal.appendChild(p);
        ul.appendChild(liPrincipal);
        // OL alternativas
        ol = document.createElement('ol');
            // forEach recibe como argumentos el elemento del arreglo y su índice (el índice es opcional)
            pregunta.alternativas.forEach((alternativa, index) =>{
                liAlternativa = document.createElement('li');
                liAlternativa.textContent = alternativa;
                // Obtiene las respuestas ya contestadas
                const seleccionGuardada = localStorage.getItem(`Pregunta${pregunta.idPregunta}`);
                                
                // addEventListener recibe como parámetro una función callback. Esta función recuerda el contexto donde fue creada
                // incluyendo la variable index
                liAlternativa.addEventListener('click', function(){
                                       
                    const evaluacion = evaluarAlernativa(this, index, pregunta);                    
                    if (evaluacion) {
                        establecerRespuestaCorrecta(this);
                    }
                    else{
                        establecerRespuestaIncorrecta(this);
                        // Encontrar alternativa correcta y establecer estilos
                        const li = encontrarRespuestaCorrecta(pregunta, this);
                        li.classList.add('respuesta-correcta-justificacion');                        
                    }
                    
                    mostrarJustificacion(this);                   
                    actualizarContadores(divContadores);
                    apagarAlternativas(this); 
                    //Guarda en localstorage
                    localStorage.setItem(`Pregunta${pregunta.idPregunta}`,index);                   
                    // Verifica si se contestaron todas las preguntas
                    if (verificarTriviaFinalizada(preguntas.length)) {
                        localStorage.clear();
                        const medallero = new Medallero(contadorCorrectas, contadorIncorrectas, totalPreguntas, imagenesPrecargadas);
                        modalApi.actualizarContenidoModal(medallero);
                        modalApi.mostrarModal();                       
                    }
                });

                ol.appendChild(liAlternativa);                         
                
            })
        liPrincipal.appendChild(ol);
        
        // Justificación
        div = document.createElement('div');
        div.classList.add('justificacion');
        p = document.createElement('p');     
        p.innerHTML = construirExplicacion(pregunta.explicacionRespuesta);
        div.appendChild(p);
        liPrincipal.appendChild(div);        
    })

    // Se agrega el UL al contenedor
    contenedor.appendChild(ul);     
    
    // Crea sección contadores
    const divContadores = crearSeccionContadores();       
   
    contenedor.appendChild(divContadores);

     // Busca las respuestas ya contestadas en el localstorage
    buscarAlternativasContestadas(ul);

    totalPreguntas = preguntas.length;

}

    function mostrarError(e) {
        if (contenedor.classList.contains('hide')) {
            contenedor.classList.remove('hide');
        }
        loader.classList.add('hide');
        contenedor.classList.add('errorTrivia');
        contenedor.innerHTML = `Trivia momentaneamente no disponible! <i class="fa-regular fa-face-sad-cry"></i>`;
    }

    // Compara el índice de la alternativa del arreglo con el número de la respuesta correcta
    // que viene en la pregunta
    function evaluarAlernativa(li, indice, pregunta){
        // se le suma 1 al índice, ya que el arreglo comienza en 0
        if (indice + 1 === pregunta.numeroAlternativaCorrecta ) {
            contadorCorrectas++;
            return true;                      
        }
        contadorIncorrectas++;
        return false;    
    }

    function mostrarJustificacion(li) {
        let div = li.parentNode.nextElementSibling;
        div.classList.add('mostrar');  
    }

    function actualizarContadores(divContadores){

        const contadores = [
            {clase: '.contador-correctas', valor: contadorCorrectas},
            {clase: '.contador-incorrectas', valor: contadorIncorrectas}
        ];

        contadores.forEach(contador => {
            divContadores.querySelector(`${contador.clase} div`).textContent = contador.valor;
        })
    
        // let divCorrectas = divContadores.querySelector('.contador-correctas');
        // let divIncorrectas = divContadores.querySelector('.contador-incorrectas');
        // divCorrectas.querySelector('div').textContent = contadorCorrectas;        
        // divIncorrectas.querySelector('div').textContent = contadorIncorrectas;

    }

    function establecerRespuestaCorrecta(li){
        li.classList.add('respuesta-correcta');
    }

    function establecerRespuestaIncorrecta(li){
        li.classList.add('respuesta-incorrecta');        
    }

    function encontrarRespuestaCorrecta(pregunta, li){       
        const ol = li.parentNode;
        //Encuentra la alternativa correcta
        const liCorrecta = ol.querySelectorAll('li')[pregunta.numeroAlternativaCorrecta-1];
        return liCorrecta;       
    }

    function apagarAlternativas(li){
       li.parentNode.classList.add('apagarLi');
    }

    function buscarAlternativasContestadas(ul){
        // Recorrer las preguntas del DOM
        ul.querySelectorAll(':scope>li').forEach(liPregunta => {
            // Obtener numero de pregunta del data-atributo
            const numeroPregunta = liPregunta.dataset.numeroPregunta;
            
            // Busca el número de la pregunta en el localstorage. Se debe concatenar "Pregunta", porque así quedó almacenado
            const indiceAlternativaGuardada = localStorage.getItem(`Pregunta${numeroPregunta}`);
             
            if (indiceAlternativaGuardada !== null) {
                // Busca la alternativa por el índice
                const li = liPregunta.querySelectorAll('ol li')[parseInt(indiceAlternativaGuardada)]
                // Gatilla evento click de la alternativa que ya había sido contestada
                li.click();                
            }            
        })       
    }

    function crearSeccionContadores(){
        let div = '';

        const divContadores = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = 'Resultados';
        divContadores.appendChild(h3);

        const contadores = [
            {clase : 'contador-correctas', valor: 'Correctas'},
            {clase : 'contador-incorrectas', valor: 'Incorrectas'}
        ];

        contadores.forEach(({clase, valor}) => {
            const div = document.createElement('div');
            div.classList.add(clase);
            const divPuntaje = document.createElement('div');
            const p = document.createElement('p');
            p.textContent = valor;
            div.append(divPuntaje, p);
            divContadores.appendChild(div);
        })

        return divContadores;
    }

    function verificarTriviaFinalizada(preguntas){
       
        const totalRespuestas = contadorCorrectas + contadorIncorrectas;
         
        if (totalRespuestas === preguntas) {
            return true;            
        }
    }

    function construirExplicacion(explicacion){
        // explicacion es un array de objects
        let mensaje = '';

        explicacion.forEach(e=> {
            
            if (e.tipo === "texto") {
                mensaje += `${e.contenido} `
            }else if (e.tipo === "link") {
                mensaje += ` <a href="${e.url}">${e.contenido}</a> `;
            } 
        })

        return mensaje;        
    }

    function limpiarHTML() {
        // Limpia HTML
        let h3Titulo = titulo.querySelector('h3');
        if (h3Titulo != null) {h3Titulo.innerHTML = ''};
        contenedor.innerHTML = '';
        contadorCorrectas = 0;
        contadorIncorrectas = 0;
        totalPreguntas = 0;        
    }

    // Algoritmo Fisher-Yates
    function barajar(arreglo){

        const arregloPermutado = [...arreglo];

        for (let i= arregloPermutado.length-1; i>=0; i--){
           
            const j = Math.floor(Math.random() * (i+1));
            //Permutación
            const temp = arregloPermutado[j];
            arregloPermutado[j] = arregloPermutado[i];
            arregloPermutado[i] = temp;

        };

        return arregloPermutado;
    }

    
    

    
    


