require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');
const testRoutes =  require('./src/routes/test')
const laporanRoutes = require('./src/routes/laporanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Root route */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Pelaporan Keluhan sedang berjalan',
    endpoints: {
      'GET    /api/laporan':      'Ambil semua laporan (opsional ?status=Baru)',
      'GET    /api/laporan/:id':  'Ambil laporan by id',
      'POST   /api/laporan':      'Buat laporan baru',
      'PUT    /api/laporan/:id':  'Update laporan / ubah status',
      'DELETE /api/laporan/:id':  'Hapus laporan',
    },
  });
});

/* Routes */
app.use('/api/test', testRoutes);
app.use('/api/laporan', laporanRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

/* Start */
(async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
  });
})();