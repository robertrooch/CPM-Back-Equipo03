class Pert {
    constructor(){
        this.idActividad = 0;
        this.Actividades = [];
    }
    nuevaActividad(nombre, duracion, predecesores) {
        this.idActividad += 1;
        const actividad = {
            id: this.idActividad,
            nombre,
            duracion: parseInt(duracion),
            predecesores: predecesores.split(',').map(e => e.trim()),
            sucesores: [],
            estart: 0,
            efinish: 0,
            lstart: 0,
            lfinish: 0,
            hlibre: -1,
            htotal: 0,
            nivel: 0
        };
        if (actividad.predecesores.includes(actividad.nombre)) {
            throw new Error(`La actividad ${actividad.nombre} no puede ser predecesora de sí misma`);
        }
        this.actividades.push(actividad);
    }

    eliminarActividad(id) {
        this.actividades = this.actividades.filter(act => act.id !== id);
    }

}
module.exports = Pert;