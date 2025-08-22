import { Medalla } from "./medalla.js";

export class MedallaOro extends Medalla {

    get tipo(){
        return 'oro';
    }

    get img(){        
        return this.imagenes['oro'];
    }

    get mensajeRendimiento(){
        return '¡Has ganado la Medalla de Oro! ¡Excepcional! ¡Felicitaciones por tus conocimientos!';
    }
    
    mensajeDetalle(){
        return `¡Muy bien! contestaste <span> ${this.correctas} </span> correctas de un total de <span> ${this.totPreguntas} </span> preguntas.`; 
    }
    
}