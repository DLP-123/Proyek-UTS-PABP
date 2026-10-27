import { useCallback, useEffect, useRef, useState } from "react";
import { getLaporan, deleteLaporan } from "../api/laporan";
import { ApiError } from "../api/client";
import { DAFTAR_STATUS } from "../types";
import type { Laporan, StatusLaporan } from "../types";
import LaporanEditForm from "./LaporanEditForm";

interface Props {
  onDetail: (id: number) => void;
}

export default function LaporanList({ onDetail }: Props) {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Laporan | null>(null);
  const [aksiError, setAksiError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // "" = semua status.
  const [filter, setFilter] = useState<StatusLaporan | "">("");

  // Hanya respons dari request terbaru yang boleh mengisi state.
  const reqId = useRef(0);

  const muat = useCallback(async () => {
    const myId = ++reqId.current;
    try {
      const data = await getLaporan(filter || undefined);
      if (myId !== reqId.current) return;
      setLaporan(data);
      setError(null);
    } catch (err) {
      if (myId !== reqId.current) return;
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      if (myId === reqId.current) setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    muat();
  }, [muat]);

  function ubahFilter(nilai: StatusLaporan | "") {
    setLoading(true);
    setFilter(nilai);
  }

  async function handleHapus(l: Laporan) {
    if (!window.confirm(`Hapus laporan "${l.judul}"?`)) return;

    setAksiError(null);
    setDeletingId(l.id);
    try {
      await deleteLaporan(l.id);
      await muat();
    } catch (err) {
      setAksiError(err instanceof Error ? err.message : "Gagal menghapus.");
      if (err instanceof ApiError && err.status === 404) await muat();
    } finally {
      setDeletingId(null);
    }
  }

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

  const kontrolFilter = (
    <div style={{ marginBottom: 12 }}>
      <label>
        Filter status:{" "}
        <select
          value={filter}
          onChange={(e) => ubahFilter(e.target.value as StatusLaporan | "")}
        >
          <option value="">Semua</option>
          {DAFTAR_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  const pesanAksi = aksiError && <p style={{ color: "red" }}>{aksiError}</p>;

  if (loading) {
    return (
      <>
        {kontrolFilter}
        <p>Memuat data laporan...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        {kontrolFilter}
        <p style={{ color: "red" }}>Gagal memuat: {error}</p>
      </>
    );
  }

  if (laporan.length === 0) {
    return (
      <>
        {kontrolFilter}
        {pesanAksi}
        <p>
          {filter
            ? `Tidak ada laporan berstatus "${filter}".`
            : "Belum ada laporan."}
        </p>
      </>
    );
  }

  return (
    <>
      {kontrolFilter}
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
              <td>{l.kategori || "-"}</td>
              <td>{l.lokasi || "-"}</td>
              <td>{l.status}</td>
              <td>
                <button onClick={() => onDetail(l.id)}>Detail</button>{" "}
                <button onClick={() => setEditing(l)}>Edit</button>{" "}
                <button
                  className="bahaya"
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