import { useState } from "react";
import type { FormEvent } from "react";
import { createPenanganan } from "../api/penanganan";
import { DAFTAR_STATUS } from "../types";
import type { StatusLaporan } from "../types";

interface Props {
  laporanId: number;
  onSukses: () => void; // dipanggil setelah POST berhasil, untuk memuat ulang detail
}

export default function PenangananForm({ laporanId, onSukses }: Props) {
  const [petugas, setPetugas] = useState("");
  const [catatan, setCatatan] = useState("");
  // "" artinya "tidak mengubah status".
  const [statusBaru, setStatusBaru] = useState<StatusLaporan | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!petugas.trim()) {
      setFormError("Nama petugas wajib diisi.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await createPenanganan({
        laporan_id: laporanId,
        petugas: petugas.trim(),
        catatan: catatan.trim() || undefined,
        status_baru: statusBaru || undefined,
      });
      setPetugas("");
      setCatatan("");
      setStatusBaru("");
      onSukses();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <h3>Tambah Penanganan</h3>
      <div>
        <label>
          Petugas (wajib):{" "}
          <input value={petugas} onChange={(e) => setPetugas(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Catatan:{" "}
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Ubah status menjadi:{" "}
          <select
            value={statusBaru}
            onChange={(e) => setStatusBaru(e.target.value as StatusLaporan | "")}
          >
            <option value="">(tidak mengubah status)</option>
            {DAFTAR_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Menyimpan..." : "Simpan Penanganan"}
      </button>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
    </form>
  );
}