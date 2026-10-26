import { request } from "./client";
import type { Laporan, StatusLaporan } from "../types";

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

export function getLaporan(): Promise<Laporan[]> {
  return request<Laporan[]>("/laporan");
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