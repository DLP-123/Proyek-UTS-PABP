CREATE TABLE IF NOT EXISTS test_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_logs DEFAULT VALUES;

CREATE TABLE IF NOT EXISTS pelapor (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nama        TEXT NOT NULL,
    email       TEXT,
    telepon     TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS laporan (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    pelapor_id  INTEGER,
    judul       TEXT NOT NULL,
    deskripsi   TEXT,
    kategori    TEXT,
    lokasi      TEXT,
    status      TEXT DEFAULT 'Baru',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pelapor_id) REFERENCES pelapor(id)
);

CREATE TABLE IF NOT EXISTS penanganan (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    laporan_id  INTEGER NOT NULL,
    petugas     TEXT NOT NULL,
    catatan     TEXT,
    status_baru TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (laporan_id) REFERENCES laporan(id)
);