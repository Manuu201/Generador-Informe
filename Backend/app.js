const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');

const userRoutes = require('./routes/userRoutes');
const machineRoutes = require('./routes/machineRoutes');
const taskRoutes = require('./routes/taskRoutes');
const observationRoutes = require('./routes/observationRoutes');
const photoRoutes = require('./routes/photoRoutes');
const lineRoutes = require('./routes/lineRoutes');
const specialistRoutes = require('./routes/specialistRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/lines', lineRoutes);
app.use('/api/specialists', specialistRoutes);

db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
