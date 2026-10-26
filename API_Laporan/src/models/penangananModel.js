const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllPenanganan = async () => {
  return await dbAll('SELECT * FROM penanganan ORDER BY id DESC');
};

const findPenangananById = async (id) => {
  return await dbGet('SELECT * FROM penanganan WHERE id = ?', [id]);
};

const findPenangananByLaporanId = async (laporanId) => {
  return await dbAll(
    'SELECT * FROM penanganan WHERE laporan_id = ? ORDER BY id ASC',
    [laporanId]
  );
};

const createPenanganan = async (body) => {
  const { lastID } = await dbRun(
    `INSERT INTO penanganan (laporan_id, petugas, catatan, status_baru)
     VALUES (?, ?, ?, ?)`,
    [
      body.laporan_id,
      body.petugas,
      body.catatan ?? null,
      body.status_baru ?? null,
    ]
  );
  return await findPenangananById(lastID);
};

const updatePenanganan = async (id, body) => {
  const existing = await findPenangananById(id);
  if (!existing) return null;

  await dbRun(
    `UPDATE penanganan
     SET petugas = ?, catatan = ?, status_baru = ?
     WHERE id = ?`,
    [
      body.petugas ?? existing.petugas,
      body.catatan ?? existing.catatan,
      body.status_baru ?? existing.status_baru,
      id,
    ]
  );
  return await findPenangananById(id);
};

const deletePenanganan = async (id) => {
  const { changes } = await dbRun('DELETE FROM penanganan WHERE id = ?', [id]);
  return changes > 0;
};

module.exports = {
  findAllPenanganan,
  findPenangananById,
  findPenangananByLaporanId,
  createPenanganan,
  updatePenanganan,
  deletePenanganan,
};