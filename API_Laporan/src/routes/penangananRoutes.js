const express = require('express');
const router = express.Router();
const penangananController = require('../controllers/penangananController');

router.get('/',       penangananController.getAllPenanganan);
router.get('/:id',    penangananController.getPenangananById);
router.post('/',      penangananController.createPenanganan);
router.put('/:id',    penangananController.updatePenanganan);
router.delete('/:id', penangananController.deletePenanganan);

module.exports = router;