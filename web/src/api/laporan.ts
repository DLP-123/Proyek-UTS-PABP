import { request } from "./client";
import type { Laporan, Penanganan, StatusLaporan } from "../types";

export interface LaporanInput {
  pelapor_id: number;
  judul: string;
  deskripsi?: string;
  kategori?: string;
  lokasi?: string;
}

// Semua field opsional: PUT hanya mengirim yang ingin diubah.
export interface LaporanUpdate {
  judul?: string;
  deskripsi?: string;
  kategori?: string;
  lokasi?: string;
  status?: StatusLaporan;
}

export function getLaporan(
  status?: StatusLaporan,
  search?: string
): Promise<Laporan[]> {
  // URLSearchParams menyusun query string dan otomatis meng-encode karakter khusus.
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const query = params.toString();
  return request<Laporan[]>(`/laporan${query ? `?${query}` : ""}`);
}

export function getLaporanById(id: number): Promise<Laporan> {
  return request<Laporan>(`/laporan/${id}`);
}

export function getPenangananLaporan(id: number): Promise<Penanganan[]> {
  return request<Penanganan[]>(`/laporan/${id}/penanganan`);
}

export function createLaporan(input: LaporanInput): Promise<Laporan> {
  return request<Laporan>("/laporan", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateLaporan(
  id: number,
  input: LaporanUpdate
): Promise<Laporan> {
  return request<Laporan>(`/laporan/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteLaporan(id: number): Promise<null> {
  return request<null>(`/laporan/${id}`, { method: "DELETE" });
}