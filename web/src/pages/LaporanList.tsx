import { useCallback, useEffect, useState } from "react";
import { getLaporan, deleteLaporan } from "../api/laporan";
import { ApiError } from "../api/client";
import type { Laporan } from "../types";
import LaporanEditForm from "./LaporanEditForm";
interface Props {
  onDetail: (id: number) => void;
}

export default function LaporanList({ onDetail }: Props) {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Laporan yang sedang diedit; null berarti tidak ada yang diedit.
  const [editing, setEditing] = useState<Laporan | null>(null);
  const [aksiError, setAksiError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const muat = useCallback(async () => {
    try {
      setLaporan(await getLaporan());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  async function handleHapus(l: Laporan) {
    // Konfirmasi dulu: penghapusan tidak bisa dibatalkan.
    if (!window.confirm(`Hapus laporan "${l.judul}"?`)) return;

    setAksiError(null);
    setDeletingId(l.id);
    try {
      await deleteLaporan(l.id);
      await muat();
    } catch (err) {
      // 409 (masih punya penanganan) dan 404 tampil lewat pesan dari server.
      setAksiError(err instanceof Error ? err.message : "Gagal menghapus.");
      // Jika sudah terhapus di tempat lain (404), segarkan daftar.
      if (err instanceof ApiError && err.status === 404) await muat();
    } finally {
      setDeletingId(null);
    }
  }

  // Semua hook di atas HARUS dipanggil sebelum return bersyarat di bawah ini.
  if (editing) {
    return (
      <LaporanEditForm
        laporan={editing}
        onBatal={() => setEditing(null)}
        onSelesai={async () => {
          setEditing(null);
          await muat();
        }}
      />
    );
  }

  const pesanAksi = aksiError && <p style={{ color: "red" }}>{aksiError}</p>;

  if (loading) return <p>Memuat data laporan...</p>;
  if (error) return <p style={{ color: "red" }}>Gagal memuat: {error}</p>;
  if (laporan.length === 0) {
    return (
      <>
        {pesanAksi}
        <p>Belum ada laporan.</p>
      </>
    );
  }

  return (
    <>
      {pesanAksi}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Judul</th>
            <th>Kategori</th>
            <th>Lokasi</th>
            <th>Status</th>
            <th>Aksi</th>
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
              <td>
                <button onClick={() => setEditing(l)}>Edit</button>{" "}
                <button onClick={() => onDetail(l.id)}>Detail</button>{" "}
                <button
                  onClick={() => handleHapus(l)}
                  disabled={deletingId === l.id}
                >
                  {deletingId === l.id ? "Menghapus..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}