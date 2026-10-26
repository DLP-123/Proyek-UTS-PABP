import { useState } from "react";
import type { FormEvent } from "react";
import { updatePenanganan } from "../api/penanganan";
import type { Penanganan } from "../types";

interface Props {
  penanganan: Penanganan;
  onSelesai: () => void;
  onBatal: () => void;
}

export default function PenangananEditForm({
  penanganan,
  onSelesai,
  onBatal,
}: Props) {
  const [petugas, setPetugas] = useState(penanganan.petugas);
  const [catatan, setCatatan] = useState(penanganan.catatan ?? "");
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
      await updatePenanganan(penanganan.id, {
        petugas: petugas.trim(),
        catatan: catatan.trim(),
      });
      onSelesai();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <h3>Edit Penanganan #{penanganan.id}</h3>
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