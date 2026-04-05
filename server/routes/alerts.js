const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alertsController');

router.get('/puppy/:puppyId', alertsController.getAlertsByPuppy);
router.post('/', alertsController.createAlert);

module.exports = router;
