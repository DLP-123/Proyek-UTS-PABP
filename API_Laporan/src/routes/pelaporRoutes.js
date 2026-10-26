const express = require('express');
const router = express.Router();
const pelaporController = require('../controllers/pelaporController');

router.get('/',       pelaporController.getAllPelapor);
router.get('/:id',    pelaporController.getPelaporById);
router.post('/',      pelaporController.createPelapor);
router.put('/:id',    pelaporController.updatePelapor);
router.delete('/:id', pelaporController.deletePelapor);

module.exports = router;