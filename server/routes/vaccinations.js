const express = require('express');
const router = express.Router();
const vaccinationsController = require('../controllers/vaccinationsController');

router.get('/puppy/:puppyId', vaccinationsController.getVaccinationsByPuppy);
router.post('/', vaccinationsController.createVaccination);
router.put('/:id', vaccinationsController.updateVaccination);
router.delete('/:id', vaccinationsController.deleteVaccination);

module.exports = router;
