import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getPelapor,
  createPelapor,
  updatePelapor,
  deletePelapor,
} from "../api/pelapor";
import { ApiError } from "../api/client";
import type { Pelapor } from "../types";

export default function PelaporPage() {
  const [pelapor, setPelapor] = useState<Pelapor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // null = mode tambah; berisi id = mode edit pelapor tersebut.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [aksiError, setAksiError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  function resetForm() {
    setEditingId(null);
    setNama("");
    setEmail("");
    setTelepon("");
    setFormError(null);
  }

  function mulaiEdit(p: Pelapor) {
    setEditingId(p.id);
    setNama(p.nama);
    setEmail(p.email ?? "");
    setTelepon(p.telepon ?? "");
    setFormError(null);
    setAksiError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nama.trim()) {
      setFormError("Nama wajib diisi.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      if (editingId === null) {
        await createPelapor({
          nama: nama.trim(),
          email: email.trim() || undefined,
          telepon: telepon.trim() || undefined,
        });
      } else {
        // Saat edit, string kosong tetap dikirim agar field bisa dikosongkan.
        await updatePelapor(editingId, {
          nama: nama.trim(),
          email: email.trim(),
          telepon: telepon.trim(),
        });
      }
      resetForm();
      await muat();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan.");
      // Pelapor sudah dihapus di tempat lain: keluar dari mode edit dan segarkan.
      if (err instanceof ApiError && err.status === 404) {
        resetForm();
        await muat();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleHapus(p: Pelapor) {
    if (!window.confirm(`Hapus pelapor "${p.nama}"?`)) return;

    setAksiError(null);
    setDeletingId(p.id);
    try {
      await deletePelapor(p.id);
      if (editingId === p.id) resetForm();
      await muat();
    } catch (err) {
      // 409 (masih punya laporan) tampil lewat pesan dari server.
      setAksiError(err instanceof Error ? err.message : "Gagal menghapus.");
      if (err instanceof ApiError && err.status === 404) await muat();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h2>Pelapor</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <h3>{editingId === null ? "Tambah Pelapor" : `Edit Pelapor #${editingId}`}</h3>
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
            <input value={telepon} onChange={(e) => setTelepon(e.target.value)} />
          </label>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting
            ? "Menyimpan..."
            : editingId === null
            ? "Tambah Pelapor"
            : "Simpan Perubahan"}
        </button>{" "}
        {editingId !== null && (
          <button type="button" onClick={resetForm} disabled={submitting}>
            Batal
          </button>
        )}
        {formError && <p style={{ color: "red" }}>{formError}</p>}
      </form>

      {aksiError && <p style={{ color: "red" }}>{aksiError}</p>}
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
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pelapor.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nama}</td>
                <td>{p.email ?? "-"}</td>
                <td>{p.telepon ?? "-"}</td>
                <td>
                  <button onClick={() => mulaiEdit(p)}>Edit</button>{" "}
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
    </div>
  );
}