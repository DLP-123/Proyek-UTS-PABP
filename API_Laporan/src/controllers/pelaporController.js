const pelaporModel = require('../models/pelaporModel');

const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

const getAllPelapor = async (req, res) => {
  try {
    const data = await pelaporModel.findAllPelapor();
    success(res, 200, 'Berhasil mengambil semua pelapor', data);
  } catch (error) {
    console.error('[getAllPelapor]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const getPelaporById = async (req, res) => {
  try {
    const data = await pelaporModel.findPelaporById(req.params.id);
    if (!data) return fail(res, 404, 'Pelapor tidak ditemukan');
    success(res, 200, 'Berhasil mengambil pelapor', data);
  } catch (error) {
    console.error('[getPelaporById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const createPelapor = async (req, res) => {
  try {
    const { nama } = req.body;
    if (!nama || nama.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'nama wajib diisi');
    }
    const created = await pelaporModel.createPelapor(req.body);
    success(res, 201, 'Pelapor berhasil dibuat', created);
  } catch (error) {
    console.error('[createPelapor]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const updatePelapor = async (req, res) => {
  try {
    const { nama } = req.body;
    if (nama !== undefined && nama.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'nama tidak boleh kosong');
    }
    const updated = await pelaporModel.updatePelapor(req.params.id, req.body);
    if (!updated) return fail(res, 404, 'Pelapor tidak ditemukan');
    success(res, 200, 'Pelapor berhasil diupdate', updated);
  } catch (error) {
    console.error('[updatePelapor]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const deletePelapor = async (req, res) => {
  try {
    const deleted = await pelaporModel.deletePelapor(req.params.id);
    if (!deleted) return fail(res, 404, 'Pelapor tidak ditemukan');
    success(res, 200, 'Pelapor berhasil dihapus');
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return fail(
        res, 409, 'Tidak bisa dihapus',
        'Pelapor masih memiliki laporan'
      );
    }
    console.error('[deletePelapor]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllPelapor,
  getPelaporById,
  createPelapor,
  updatePelapor,
  deletePelapor,
};