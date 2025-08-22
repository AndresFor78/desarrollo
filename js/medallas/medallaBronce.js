import { Medalla } from "./medalla.js";

export class MedallaBronce extends Medalla {

    get tipo(){
        return 'bronce';
    }

    get img(){
        return this.imagenes['bronce'];
    }

    get mensajeRendimiento(){
        return 'Has obtenido medalla de bronce. ¡La próxima será mejor!';
    }

    mensajeDetalle(){
        return `Contestaste <span> ${this.correctas} </span> correctas de un total de <span> ${this.totPreguntas} </span> preguntas.`;
    }
    
}