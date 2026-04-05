const express = require('express');
const router = express.Router();
const vetVisitsController = require('../controllers/vetVisitsController');

router.get('/puppy/:puppyId', vetVisitsController.getVisitsByPuppy);
router.post('/', vetVisitsController.createVisit);
router.put('/:id', vetVisitsController.updateVisit);
router.delete('/:id', vetVisitsController.deleteVisit);

module.exports = router;
