import { useEffect, useState } from "react";
import { getLaporanById, getPenangananLaporan } from "../api/laporan";
import { getPelaporById } from "../api/pelapor";
import { deletePenanganan } from "../api/penanganan";
import { ApiError } from "../api/client";
import type { Laporan, Pelapor, Penanganan } from "../types";
import PenangananForm from "./PenangananForm";
import PenangananEditForm from "./PenangananEditForm";

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
  const [refresh, setRefresh] = useState(0);

  // Penanganan yang sedang diedit; null = tidak ada.
  const [editing, setEditing] = useState<Penanganan | null>(null);
  const [aksiError, setAksiError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let batal = false;

    async function muat() {
      try {
        setLoading(true);
        setError(null);
        const l = await getLaporanById(id);
        const [r, p] = await Promise.all([
          getPenangananLaporan(id),
          getPelaporById(l.pelapor_id).catch(() => null),
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
  }, [id, refresh]);

  async function handleHapus(p: Penanganan) {
    if (!window.confirm(`Hapus penanganan oleh "${p.petugas}"?`)) return;

    setAksiError(null);
    setDeletingId(p.id);
    try {
      await deletePenanganan(p.id);
      setRefresh((n) => n + 1);
    } catch (err) {
      setAksiError(err instanceof Error ? err.message : "Gagal menghapus.");
      if (err instanceof ApiError && err.status === 404) {
        setRefresh((n) => n + 1);
      }
    } finally {
      setDeletingId(null);
    }
  }

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
      {aksiError && <p style={{ color: "red" }}>{aksiError}</p>}
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
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.map((p) => (
              <tr key={p.id}>
                <td>{formatTanggal(p.created_at)}</td>
                <td>{p.petugas}</td>
                <td>{p.catatan ?? "-"}</td>
                <td>{p.status_baru ?? "-"}</td>
                <td>
                  <button onClick={() => setEditing(p)}>Edit</button>{" "}
                  <button
                    onClick={() => handleHapus(p)}
                    disabled={deletingId === p.id}
                  >
                    {deletingId === p.id ? "Menghapus..." : "Hapus"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing ? (
        <PenangananEditForm
          key={editing.id}
          penanganan={editing}
          onBatal={() => setEditing(null)}
          onSelesai={() => {
            setEditing(null);
            setRefresh((n) => n + 1);
          }}
        />
      ) : (
        <PenangananForm
          laporanId={laporan.id}
          onSukses={() => setRefresh((n) => n + 1)}
        />
      )}
    </div>
  );
}