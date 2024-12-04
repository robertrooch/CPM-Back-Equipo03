const express = require('express');
const cors = require('cors');
const Pert = require('./services/pert');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(bodyParser.json());

const pert = new Pert();

app.get('/actividades-cpm/:proyectoId', async (req, res) => {
    const { proyectoId } = req.params;

    try {
        // Obtener todas las actividades relacionadas con un proyecto
        const actividades = await ActividadCPM.findAll({
            where: {
                proyectoId: proyectoId
            }
        });

        if (actividades.length === 0) {
            return res.status(404).json({ error: 'No se encontraron actividades para este proyecto.' });
        }

        res.json(actividades);
    } catch (error) {
        console.error('Error al obtener actividades de proyecto:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/nueva-actividad', (req, res) => {
    const { nombre, duracion, predecesores } = req.body;
    try {
        pert.nuevaActividad(nombre, duracion, predecesores);
        res.status(201).json({ message: 'Actividad agregada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/guardar-cpm', async (req, res) => {
    try {
        const { actividades, proyectoId } = req.body;  // Ahora recibimos también el proyectoId
        console.log('Datos recibidos:', req.body);
        // Validar que se reciban las actividades y el proyectoId
        if (!actividades || actividades.length === 0) {
            return res.status(400).json({ error: 'No se recibieron actividades para guardar.' });
        }

        if (!proyectoId) {
            return res.status(400).json({ error: 'El ID del proyecto es obligatorio.' });
        }

        // Guardar las actividades en la base de datos, asociadas al proyectoId
        for (const actividad of actividades) {
            await ActividadCPM.create({
                nombre: actividad.nombre,
                duracion: actividad.duracion,
                estart: actividad.estart,
                efinish: actividad.efinish,
                lstart: actividad.lstart,
                lfinish: actividad.lfinish,
                htotal: actividad.htotal,
                hlibre: actividad.hlibre,
                es_critica: actividad.htotal === 0, // Marca como crítica si tiene holgura total 0
                predecesores: JSON.stringify(actividad.predecesores), // Almacenar los predecesores como cadena JSON
                sucesores: JSON.stringify(actividad.sucesores), // Almacenar los sucesores como cadena JSON
                proyectoId: proyectoId  // Asociamos la actividad con el proyecto
            });
        }

        res.json({ message: 'Actividades CPM guardadas exitosamente en la base de datos' });
    } catch (error) {
        console.error('Error al guardar actividades CPM:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/actividades-cpm', async (req, res) => {
    try {
        const actividades = await ActividadCPM.findAll();
        res.json(actividades);
    } catch (error) {
        console.error('Error al consultar actividades CPM:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/calcular-tiempos', (req, res) => {
    try {
        const resultado = pert.generarDiagrama();
        res.json({ actividades: resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/limpiar-actividades', (req, res) => {
    try {
        pert.limpiarActividades();
        //console.log('Actividades actuales después de limpiar:', pert.actividades);
        res.status(200).json({ message: 'Actividades limpiadas correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
