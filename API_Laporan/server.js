require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');
const testRoutes =  require('./src/routes/test')
const laporanRoutes = require('./src/routes/laporanRoutes');
const pelaporRoutes = require('./src/routes/pelaporRoutes');
const penangananRoutes = require('./src/routes/penangananRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Root route */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Server jalan dengan aman nih bos!',
    endpoints: {
      'GET    /api/laporan':      'Semua laporan berhasil ditampilkan (opsional ?status=Baru)',
      'GET    /api/laporan/:id':  'Semua laporan berdasarkan ID',
      'POST   /api/laporan':      'Lapor Yuk!',
      'PUT    /api/laporan/:id':  'Ubah Laporan',
      'DELETE /api/laporan/:id':  'Hapus laporan',
    },
  });
});

/* Routes */
app.use('/api/test', testRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/pelapor', pelaporRoutes);
app.use('/api/penanganan', penangananRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ga ada nih endpointnya!' });
});

/* Start */
(async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
  });
})();