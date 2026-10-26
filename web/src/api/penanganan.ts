import { request } from "./client";
import type { Penanganan, StatusLaporan } from "../types";

// Bentuk body POST /penanganan sesuai kontrak.
export interface PenangananInput {
  laporan_id: number;
  petugas: string;
  catatan?: string;
  status_baru?: StatusLaporan;
}

export function createPenanganan(input: PenangananInput): Promise<Penanganan> {
  return request<Penanganan>("/penanganan", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Hanya field yang aman: kontrak tidak merinci body PUT /penanganan.
export interface PenangananUpdate {
  petugas?: string;
  catatan?: string;
}

export function updatePenanganan(
  id: number,
  input: PenangananUpdate
): Promise<Penanganan> {
  return request<Penanganan>(`/penanganan/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deletePenanganan(id: number): Promise<null> {
  return request<null>(`/penanganan/${id}`, { method: "DELETE" });
}