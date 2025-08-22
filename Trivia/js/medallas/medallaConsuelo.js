import { Medalla } from "./medalla.js";

export class MedallaConsuelo extends Medalla{

    get tipo(){
        return 'consuelo';
    }

    get img(){
        return this.imagenes['consuelo'];
    }

    get mensajeRendimiento(){
        return 'Lo siento, no has obtenido ninguna medalla... ¡La próxima será mejor!';
    }

    mensajeDetalle(){
        return `Sigue intentando! Contestaste <span> ${this.correctas} </span> correctas de un total de <span> ${this.totPreguntas} </span> preguntas.`;
    }
}