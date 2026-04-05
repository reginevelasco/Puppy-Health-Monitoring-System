const express = require('express');
const router = express.Router();
const growthTrackingController = require('../controllers/growthTrackingController');

router.get('/puppy/:puppyId', growthTrackingController.getGrowthByPuppy);
router.post('/', growthTrackingController.createGrowthRecord);
router.put('/:id', growthTrackingController.updateGrowthRecord);
router.delete('/:id', growthTrackingController.deleteGrowthRecord);

module.exports = router;
