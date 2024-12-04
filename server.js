const express = require('express');
const cors = require('cors');
const Pert = require('./services/pert');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(bodyParser.json());

const pert = new Pert();

app.post('/nueva-actividad', (req, res) => {
    const { nombre, duracion, predecesores } = req.body;
    try {
        pert.nuevaActividad(nombre, duracion, predecesores);
        res.status(201).json({ message: 'Actividad agregada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
