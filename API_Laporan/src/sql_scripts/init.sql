CREATE TABLE IF NOT EXISTS test_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_logs DEFAULT VALUES;

CREATE TABLE IF NOT EXISTS laporan (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    pelapor_id  INTEGER,
    judul       TEXT NOT NULL,
    deskripsi   TEXT,
    kategori    TEXT,
    lokasi      TEXT,
    status      TEXT DEFAULT 'Baru',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);