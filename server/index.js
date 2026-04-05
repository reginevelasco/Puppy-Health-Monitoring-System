const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './server/.env' });

const puppiesRoutes = require('./routes/puppies');
const healthRecordsRoutes = require('./routes/health-records');
const vaccinationsRoutes = require('./routes/vaccinations');
const growthTrackingRoutes = require('./routes/growth-tracking');
const ownersRoutes = require('./routes/owners');
const medicationsRoutes = require('./routes/medications');
const vetVisitsRoutes = require('./routes/vet-visits');
const alertsRoutes = require('./routes/alerts');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from client folder
const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));

app.use('/api/puppies', puppiesRoutes);
app.use('/api/health-records', healthRecordsRoutes);
app.use('/api/vaccinations', vaccinationsRoutes);
app.use('/api/growth-tracking', growthTrackingRoutes);
app.use('/api/owners', ownersRoutes);
app.use('/api/medications', medicationsRoutes);
app.use('/api/vet-visits', vetVisitsRoutes);
app.use('/api/alerts', alertsRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
