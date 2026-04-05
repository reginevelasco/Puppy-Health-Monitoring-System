const express = require('express');
const router = express.Router();
const healthRecordsController = require('../controllers/healthRecordsController');

router.get('/puppy/:puppyId', healthRecordsController.getHealthRecordsByPuppy);
router.post('/', healthRecordsController.createHealthRecord);
router.put('/:id', healthRecordsController.updateHealthRecord);
router.delete('/:id', healthRecordsController.deleteHealthRecord);

module.exports = router;
