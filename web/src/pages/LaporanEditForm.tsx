import { useState } from "react";
import type { FormEvent } from "react";
import { updateLaporan } from "../api/laporan";
import { DAFTAR_STATUS } from "../types";
import type { Laporan, StatusLaporan } from "../types";

interface Props {
  laporan: Laporan;
  onSelesai: () => void; // dipanggil setelah PUT berhasil
  onBatal: () => void;
}

export default function LaporanEditForm({ laporan, onSelesai, onBatal }: Props) {
  // Nilai awal state diambil dari props SEKALI saat komponen pertama dipasang.
  const [judul, setJudul] = useState(laporan.judul);
  const [deskripsi, setDeskripsi] = useState(laporan.deskripsi ?? "");
  const [kategori, setKategori] = useState(laporan.kategori ?? "");
  const [lokasi, setLokasi] = useState(laporan.lokasi ?? "");
  const [status, setStatus] = useState<StatusLaporan>(laporan.status);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!judul.trim()) {
      setFormError("Judul wajib diisi.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await updateLaporan(laporan.id, {
        judul: judul.trim(),
        // Pada edit, string kosong tetap dikirim supaya pengguna bisa mengosongkan field.
        deskripsi: deskripsi.trim(),
        kategori: kategori.trim(),
        lokasi: lokasi.trim(),
        status,
      });
      onSelesai();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Laporan #{laporan.id}</h2>

      <div>
        <label>
          Judul (wajib):{" "}
          <input value={judul} onChange={(e) => setJudul(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Deskripsi:{" "}
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Kategori:{" "}
          <input value={kategori} onChange={(e) => setKategori(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Lokasi:{" "}
          <input value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Status:{" "}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusLaporan)}
          >
            {DAFTAR_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Menyimpan..." : "Simpan Perubahan"}
      </button>{" "}
      <button type="button" onClick={onBatal} disabled={submitting}>
        Batal
      </button>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
    </form>
  );
}