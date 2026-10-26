const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const penangananController = require('../controllers/penangananController');

router.get('/',       laporanController.getAllLaporan);
router.get('/:id',    laporanController.getLaporanById);
router.get('/:id/penanganan', penangananController.getPenangananByLaporan);
router.post('/',      laporanController.createLaporan);
router.put('/:id',    laporanController.updateLaporan);
router.delete('/:id', laporanController.deleteLaporan);

module.exports = router;