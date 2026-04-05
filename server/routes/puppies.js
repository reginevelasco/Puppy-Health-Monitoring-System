const express = require('express');
const router = express.Router();
const puppiesController = require('../controllers/puppiesController');

router.get('/', puppiesController.getAllPuppies);
router.get('/:id', puppiesController.getPuppyById);
router.post('/', puppiesController.createPuppy);
router.put('/:id', puppiesController.updatePuppy);
router.delete('/:id', puppiesController.deletePuppy);

module.exports = router;
