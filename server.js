const express = require('express');
const cors = require('cors');
const Pert = require('./services/pert');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
