import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getPelapor } from "../api/pelapor";
import { createLaporan } from "../api/laporan";
import type { Pelapor } from "../types";

interface Props {
  // Dipanggil setelah laporan berhasil dibuat (dipakai App untuk pindah halaman).
  onSukses: () => void;
}

export default function LaporanForm({ onSukses }: Props) {
  // Data untuk dropdown
  const [daftarPelapor, setDaftarPelapor] = useState<Pelapor[]>([]);
  const [loadingPelapor, setLoadingPelapor] = useState(true);
  const [errorPelapor, setErrorPelapor] = useState<string | null>(null);

  // Nilai form. <select> selalu menghasilkan string, jadi pelaporId bertipe string.
  const [pelaporId, setPelaporId] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [lokasi, setLokasi] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let batal = false;

    async function muat() {
      try {
        const data = await getPelapor();
        if (!batal) setDaftarPelapor(data);
      } catch (err) {
        if (!batal) {
          setErrorPelapor(
            err instanceof Error ? err.message : "Terjadi kesalahan."
          );
        }
      } finally {
        if (!batal) setLoadingPelapor(false);
      }
    }

    muat();
    return () => {
      batal = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!pelaporId) {
      setFormError("Pilih pelapor terlebih dahulu.");
      return;
    }
    if (!judul.trim()) {
      setFormError("Judul wajib diisi.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await createLaporan({
        pelapor_id: Number(pelaporId), // string dari <select> diubah jadi angka
        judul: judul.trim(),
        deskripsi: deskripsi.trim() || undefined,
        kategori: kategori.trim() || undefined,
        lokasi: lokasi.trim() || undefined,
      });
      onSukses();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingPelapor) return <p>Memuat daftar pelapor...</p>;
  if (errorPelapor) {
    return <p style={{ color: "red" }}>Gagal memuat pelapor: {errorPelapor}</p>;
  }
  if (daftarPelapor.length === 0) {
    return (
      <p>
        Belum ada pelapor. Tambahkan pelapor dulu di halaman Pelapor, karena
        laporan wajib punya pelapor.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Buat Laporan</h2>

      <div>
        <label>
          Pelapor (wajib):{" "}
          <select value={pelaporId} onChange={(e) => setPelaporId(e.target.value)}>
            <option value="">-- Pilih pelapor --</option>
            {daftarPelapor.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>
        </label>
      </div>

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

      <button type="submit" disabled={submitting}>
        {submitting ? "Menyimpan..." : "Kirim Laporan"}
      </button>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
    </form>
  );
}