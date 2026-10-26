const laporanModel = require('../models/laporanModel');

const STATUS_VALID = ['Baru', 'Diproses', 'Selesai', 'Ditolak'];

const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

const getAllLaporan = async (req, res) => {
  try {
    const data = await laporanModel.findAllLaporan(req.query.status);
    success(res, 200, 'Berhasil mengambil semua laporan', data);
  } catch (error) {
    console.error('[getAllLaporan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const getLaporanById = async (req, res) => {
  try {
    const data = await laporanModel.findLaporanById(req.params.id);
    if (!data) return fail(res, 404, 'Laporan tidak ditemukan');
    success(res, 200, 'Berhasil mengambil laporan', data);
  } catch (error) {
    console.error('[getLaporanById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const createLaporan = async (req, res) => {
  try {
    const { judul } = req.body;
    if (!judul || judul.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'judul wajib diisi');
    }
    const created = await laporanModel.createLaporan(req.body);
    success(res, 201, 'Laporan berhasil dibuat', created);
  } catch (error) {
    console.error('[createLaporan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const updateLaporan = async (req, res) => {
  try {
    const { status } = req.body;
    if (status !== undefined && !STATUS_VALID.includes(status)) {
      return fail(
        res, 400, 'Validasi gagal',
        `status harus salah satu dari: ${STATUS_VALID.join(', ')}`
      );
    }
    const updated = await laporanModel.updateLaporan(req.params.id, req.body);
    if (!updated) return fail(res, 404, 'Laporan tidak ditemukan');
    success(res, 200, 'Laporan berhasil diupdate', updated);
  } catch (error) {
    console.error('[updateLaporan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const deleteLaporan = async (req, res) => {
  try {
    const deleted = await laporanModel.deleteLaporan(req.params.id);
    if (!deleted) return fail(res, 404, 'Laporan tidak ditemukan');
    success(res, 200, 'Laporan berhasil dihapus');
  } catch (error) {
    console.error('[deleteLaporan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllLaporan,
  getLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
};