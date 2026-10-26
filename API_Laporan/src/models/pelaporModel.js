const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllPelapor = async () => {
  return await dbAll('SELECT * FROM pelapor ORDER BY id DESC');
};

const findPelaporById = async (id) => {
  return await dbGet('SELECT * FROM pelapor WHERE id = ?', [id]);
};

const createPelapor = async (body) => {
  const { lastID } = await dbRun(
    'INSERT INTO pelapor (nama, email, telepon) VALUES (?, ?, ?)',
    [body.nama, body.email ?? null, body.telepon ?? null]
  );
  return await findPelaporById(lastID);
};

const updatePelapor = async (id, body) => {
  const existing = await findPelaporById(id);
  if (!existing) return null;

  await dbRun(
    `UPDATE pelapor
     SET nama = ?, email = ?, telepon = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      body.nama ?? existing.nama,
      body.email ?? existing.email,
      body.telepon ?? existing.telepon,
      id,
    ]
  );
  return await findPelaporById(id);
};

const deletePelapor = async (id) => {
  const { changes } = await dbRun('DELETE FROM pelapor WHERE id = ?', [id]);
  return changes > 0;
};

module.exports = {
  findAllPelapor,
  findPelaporById,
  createPelapor,
  updatePelapor,
  deletePelapor,
};