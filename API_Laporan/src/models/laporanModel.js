const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllLaporan = async (status) => {
  if (status) {
    return await dbAll(
      'SELECT * FROM laporan WHERE status = ? ORDER BY id DESC',
      [status]
    );
  }
  return await dbAll('SELECT * FROM laporan ORDER BY id DESC');
};

const findLaporanById = async (id) => {
  return await dbGet('SELECT * FROM laporan WHERE id = ?', [id]);
};

const createLaporan = async (body) => {
  const { lastID } = await dbRun(
    `INSERT INTO laporan (pelapor_id, judul, deskripsi, kategori, lokasi)
     VALUES (?, ?, ?, ?, ?)`,
    [
      body.pelapor_id ?? null,
      body.judul,
      body.deskripsi ?? null,
      body.kategori ?? null,
      body.lokasi ?? null,
    ]
  );
  return await findLaporanById(lastID);
};

const updateLaporan = async (id, body) => {
  const existing = await findLaporanById(id);
  if (!existing) return null;

  await dbRun(
    `UPDATE laporan
     SET pelapor_id = ?, judul = ?, deskripsi = ?, kategori = ?, lokasi = ?,
         status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      body.pelapor_id ?? existing.pelapor_id,
      body.judul ?? existing.judul,
      body.deskripsi ?? existing.deskripsi,
      body.kategori ?? existing.kategori,
      body.lokasi ?? existing.lokasi,
      body.status ?? existing.status,
      id,
    ]
  );
  return await findLaporanById(id);
};

const deleteLaporan = async (id) => {
  const { changes } = await dbRun('DELETE FROM laporan WHERE id = ?', [id]);
  return changes > 0;
};

module.exports = {
  findAllLaporan,
  findLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
};