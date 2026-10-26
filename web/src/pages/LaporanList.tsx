import { useEffect, useState } from "react";
import { getLaporan } from "../api/laporan";
import type { Laporan } from "../types";

export default function LaporanList() {
  // Tiga state: data, status loading, dan pesan error.
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Penanda: jika komponen sudah dibongkar, jangan update state lagi.
    let batal = false;

    async function muat() {
      try {
        setLoading(true);
        setError(null);
        const data = await getLaporan();
        if (!batal) setLaporan(data);
      } catch (err) {
        if (!batal) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
        }
      } finally {
        if (!batal) setLoading(false);
      }
    }

    muat();

    // Fungsi cleanup: dijalankan React saat komponen dilepas.
    return () => {
      batal = true;
    };
  }, []);

  if (loading) return <p>Memuat data laporan...</p>;
  if (error) return <p style={{ color: "red" }}>Gagal memuat: {error}</p>;
  if (laporan.length === 0) return <p>Belum ada laporan.</p>;

  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Judul</th>
          <th>Kategori</th>
          <th>Lokasi</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {laporan.map((l) => (
          <tr key={l.id}>
            <td>{l.id}</td>
            <td>{l.judul}</td>
            <td>{l.kategori ?? "-"}</td>
            <td>{l.lokasi ?? "-"}</td>
            <td>{l.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}