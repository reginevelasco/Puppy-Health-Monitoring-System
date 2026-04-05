const express = require('express');
const router = express.Router();
const medicationsController = require('../controllers/medicationsController');

router.get('/puppy/:puppyId', medicationsController.getMedicationsByPuppy);
router.post('/', medicationsController.createMedication);
router.put('/:id', medicationsController.updateMedication);
router.delete('/:id', medicationsController.deleteMedication);

module.exports = router;
