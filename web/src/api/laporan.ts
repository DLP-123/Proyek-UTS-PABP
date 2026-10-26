import { request } from "./client";
import type { Laporan } from "../types";

// Bentuk body POST /laporan sesuai kontrak.
export interface LaporanInput {
  pelapor_id: number;
  judul: string;
  deskripsi?: string;
  kategori?: string;
  lokasi?: string;
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