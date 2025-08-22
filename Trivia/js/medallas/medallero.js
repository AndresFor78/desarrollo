import { MedallaOro, MedallaPlata, MedallaBronce } from "./index.js";
import { MedallaConsuelo } from "./medallaConsuelo.js";

export class Medallero {

    constructor(correctas, incorrectas, totPreguntas, imagenes) {
        this.correctas = correctas;
        this.incorrectas = incorrectas;
        this.totPreguntas = totPreguntas;
        this.imagenes = imagenes;
    }  

    calcularPorcentaje(){
        return (this.correctas/this.totPreguntas) * 100;      
    }

    obtenerMedalla(){

        let porcentaje = this.calcularPorcentaje();

        const rangos = [
            { minimo: 100, medalla: new MedallaOro(this.correctas, this.totPreguntas, this.imagenes).crearEstructuraMedalla()},
            { minimo: 80, medalla: new MedallaPlata(this.correctas, this.totPreguntas, this.imagenes).crearEstructuraMedalla()},
            { minimo: 40, medalla: new MedallaBronce(this.correctas, this.totPreguntas, this.imagenes).crearEstructuraMedalla()},
            { minimo: 0, medalla: new MedallaConsuelo(this.correctas, this.totPreguntas, this.imagenes).crearEstructuraMedalla()}
        ]

        return rangos.find(r => porcentaje >= r.minimo).medalla;
       
    }
}