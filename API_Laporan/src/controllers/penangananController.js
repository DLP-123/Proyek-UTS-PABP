const penangananModel = require('../models/penangananModel');
const laporanModel = require('../models/laporanModel');

const STATUS_VALID = ['Baru', 'Diproses', 'Selesai', 'Ditolak'];

const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

const getAllPenanganan = async (req, res) => {
  try {
    const data = await penangananModel.findAllPenanganan();
    success(res, 200, 'Berhasil mengambil semua penanganan', data);
  } catch (error) {
    console.error('[getAllPenanganan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const getPenangananById = async (req, res) => {
  try {
    const data = await penangananModel.findPenangananById(req.params.id);
    if (!data) return fail(res, 404, 'Penanganan tidak ditemukan');
    success(res, 200, 'Berhasil mengambil penanganan', data);
  } catch (error) {
    console.error('[getPenangananById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

// GET /api/laporan/:id/penanganan
const getPenangananByLaporan = async (req, res) => {
  try {
    const laporan = await laporanModel.findLaporanById(req.params.id);
    if (!laporan) return fail(res, 404, 'Laporan tidak ditemukan');

    const data = await penangananModel.findPenangananByLaporanId(req.params.id);
    success(res, 200, 'Berhasil mengambil riwayat penanganan', data);
  } catch (error) {
    console.error('[getPenangananByLaporan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const createPenanganan = async (req, res) => {
  try {
    const { laporan_id, petugas, status_baru } = req.body;

    if (!laporan_id) {
      return fail(res, 400, 'Validasi gagal', 'laporan_id wajib diisi');
    }
    if (!petugas || petugas.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'petugas wajib diisi');
    }
    if (status_baru !== undefined && !STATUS_VALID.includes(status_baru)) {
      return fail(
        res, 400, 'Validasi gagal',
        `status_baru harus salah satu dari: ${STATUS_VALID.join(', ')}`
      );
    }

    const laporan = await laporanModel.findLaporanById(laporan_id);
    if (!laporan) {
      return fail(res, 404, 'Laporan tidak ditemukan', `laporan_id ${laporan_id} tidak ada`);
    }

    const created = await penangananModel.createPenanganan(req.body);

    // Ubah status laporan otomatis kalau status_baru dikirim
    if (status_baru) {
      await laporanModel.updateLaporan(laporan_id, { status: status_baru });
    }

    success(res, 201, 'Penanganan berhasil dibuat', created);
  } catch (error) {
    console.error('[createPenanganan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const updatePenanganan = async (req, res) => {
  try {
    const { petugas, status_baru } = req.body;
    if (petugas !== undefined && petugas.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'petugas tidak boleh kosong');
    }
    if (status_baru !== undefined && !STATUS_VALID.includes(status_baru)) {
      return fail(
        res, 400, 'Validasi gagal',
        `status_baru harus salah satu dari: ${STATUS_VALID.join(', ')}`
      );
    }

    const updated = await penangananModel.updatePenanganan(req.params.id, req.body);
    if (!updated) return fail(res, 404, 'Penanganan tidak ditemukan');
    success(res, 200, 'Penanganan berhasil diupdate', updated);
  } catch (error) {
    console.error('[updatePenanganan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const deletePenanganan = async (req, res) => {
  try {
    const deleted = await penangananModel.deletePenanganan(req.params.id);
    if (!deleted) return fail(res, 404, 'Penanganan tidak ditemukan');
    success(res, 200, 'Penanganan berhasil dihapus');
  } catch (error) {
    console.error('[deletePenanganan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllPenanganan,
  getPenangananById,
  getPenangananByLaporan,
  createPenanganan,
  updatePenanganan,
  deletePenanganan,
};