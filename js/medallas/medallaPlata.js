import { Medalla } from "./medalla.js";

export class MedallaPlata extends Medalla {

    get tipo(){
        return 'plata';
    }

    get img(){
        return this.imagenes['plata'];
    }

    get mensajeRendimiento(){
        return '!Has obtenido medalla de plata! Bien, pero puedes mejorar!';
    }

    mensajeDetalle(){
        return `Contestaste <span> ${this.correctas} </span> correctas de un total de <span> ${this.totPreguntas} </span> preguntas. ¡Seguro puedes mejorarlo!`;
    }
    
}