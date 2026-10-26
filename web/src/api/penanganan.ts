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