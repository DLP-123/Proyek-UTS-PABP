import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getPelapor, createPelapor } from "../api/pelapor";
import type { Pelapor } from "../types";

export default function PelaporPage() {
  // State untuk daftar
  const [pelapor, setPelapor] = useState<Pelapor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk form: satu state per input (controlled form)
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fungsi muat data dibuat sekali dan dipakai ulang setelah POST berhasil.
  const muat = useCallback(async () => {
    try {
      setPelapor(await getPelapor());
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // cegah browser me-reload halaman saat submit

    if (!nama.trim()) {
      setFormError("Nama wajib diisi.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await createPelapor({
        nama: nama.trim(),
        // String kosong diubah jadi undefined supaya tidak ikut terkirim.
        email: email.trim() || undefined,
        telepon: telepon.trim() || undefined,
      });
      setNama("");
      setEmail("");
      setTelepon("");
      await muat(); // ambil ulang daftar dari server
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2>Pelapor</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div>
          <label>
            Nama (wajib):{" "}
            <input value={nama} onChange={(e) => setNama(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Email:{" "}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Telepon:{" "}
            <input
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
            />
          </label>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Tambah Pelapor"}
        </button>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
      </form>

      {loading && <p>Memuat data pelapor...</p>}
      {error && <p style={{ color: "red" }}>Gagal memuat: {error}</p>}
      {!loading && !error && pelapor.length === 0 && <p>Belum ada pelapor.</p>}
      {!loading && !error && pelapor.length > 0 && (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Telepon</th>
            </tr>
          </thead>
          <tbody>
            {pelapor.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nama}</td>
                <td>{p.email ?? "-"}</td>
                <td>{p.telepon ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}