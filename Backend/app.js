const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const path = require('path');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const machineRoutes = require('./routes/machineRoutes');
const taskRoutes = require('./routes/taskRoutes');
const observationRoutes = require('./routes/observationRoutes');
const photoRoutes = require('./routes/photoRoutes'); // Aquí importamos las rutas de fotos
const lineRoutes = require('./routes/lineRoutes');
const specialistRoutes = require('./routes/specialistRoutes');
const submachineRoutes = require('./routes/submachineRoutes');
const reportsRouter = require('./routes/reportRoutes');

const app = express();

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: 'http://localhost:3001', // Puerto donde está corriendo el frontend
}));

app.use(bodyParser.json());
app.use('/imagenes', express.static('imagenes')); // Servir archivos estáticos desde 'imagenes'

// Define las rutas
app.use('/api/users', userRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/submachines', submachineRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/photos', photoRoutes); // Aquí usamos las rutas de fotos
app.use('/api/lines', lineRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/reports', reportsRouter);

// Sincroniza la base de datos
db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
