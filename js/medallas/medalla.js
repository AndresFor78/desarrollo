export class Medalla {

    constructor(correctas, totPreguntas, imagenes) {
        this.correctas = correctas;
        this.totPreguntas = totPreguntas;   
        this.imagenes = imagenes;     
    }

    get tipo(){};

    get img(){};

    get mensajeRendimiento(){};

    mensajeDetalle(){};    

    crearEstructuraMedalla(){
        return {
            tipo: this.tipo,
            img: this.img,
            mensajeRendimiento: this.mensajeRendimiento,
            mensajeDetalle: this.mensajeDetalle()
        }
    }

}