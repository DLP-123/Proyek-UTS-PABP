import { useEffect, useState } from "react";
import { getLaporanById, getPenangananLaporan } from "../api/laporan";
import { getPelaporById } from "../api/pelapor";
import type { Laporan, Pelapor, Penanganan } from "../types";

interface Props {
  id: number;
  onKembali: () => void;
}

function formatTanggal(s: string): string {
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleString("id-ID");
}

export default function LaporanDetail({ id, onKembali }: Props) {
  const [laporan, setLaporan] = useState<Laporan | null>(null);
  const [pelapor, setPelapor] = useState<Pelapor | null>(null);
  const [riwayat, setRiwayat] = useState<Penanganan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let batal = false;

    async function muat() {
      try {
        setLoading(true);
        setError(null);
        // Laporan dulu, karena pelapor_id baru diketahui dari sini.
        const l = await getLaporanById(id);
        // Dua request berikutnya tidak saling bergantung, jadi dijalankan bersamaan.
        const [r, p] = await Promise.all([
          getPenangananLaporan(id),
          getPelaporById(l.pelapor_id).catch(() => null), // gagal ambil pelapor tidak boleh mematikan halaman
        ]);
        if (!batal) {
          setLaporan(l);
          setRiwayat(r);
          setPelapor(p);
        }
      } catch (err) {
        if (!batal) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
        }
      } finally {
        if (!batal) setLoading(false);
      }
    }

    muat();
    return () => {
      batal = true;
    };
  }, [id]);

  const tombolKembali = <button onClick={onKembali}>← Kembali</button>;

  if (loading) return <p>Memuat detail laporan...</p>;
  if (error || !laporan) {
    return (
      <div>
        {tombolKembali}
        <p style={{ color: "red" }}>Gagal memuat: {error ?? "Data kosong."}</p>
      </div>
    );
  }

  return (
    <div>
      {tombolKembali}
      <h2>
        Laporan #{laporan.id}: {laporan.judul}
      </h2>
      <table border={1} cellPadding={8}>
        <tbody>
          <tr><th>Status</th><td>{laporan.status}</td></tr>
          <tr><th>Pelapor</th><td>{pelapor ? pelapor.nama : `(id ${laporan.pelapor_id})`}</td></tr>
          <tr><th>Kategori</th><td>{laporan.kategori ?? "-"}</td></tr>
          <tr><th>Lokasi</th><td>{laporan.lokasi ?? "-"}</td></tr>
          <tr><th>Deskripsi</th><td>{laporan.deskripsi ?? "-"}</td></tr>
          <tr><th>Dibuat</th><td>{formatTanggal(laporan.created_at)}</td></tr>
        </tbody>
      </table>

      <h3>Riwayat Penanganan</h3>
      {riwayat.length === 0 ? (
        <p>Belum ada penanganan.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Petugas</th>
              <th>Catatan</th>
              <th>Status Baru</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.map((p) => (
              <tr key={p.id}>
                <td>{formatTanggal(p.created_at)}</td>
                <td>{p.petugas}</td>
                <td>{p.catatan ?? "-"}</td>
                <td>{p.status_baru ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}