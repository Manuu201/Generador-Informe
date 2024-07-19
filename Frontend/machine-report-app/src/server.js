const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rutas
const machineRoutes = require('../../../Backend/routes/machineRoutes');
const submachineRoutes = require('../../../Backend/routes/submachineRoutes');

app.use('/api/machines', machineRoutes);
app.use('/api/submachines', submachineRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
