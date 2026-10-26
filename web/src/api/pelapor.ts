import { request } from "./client";
import type { Pelapor } from "../types";

// Bentuk data yang dikirim ke server (sesuai body POST di kontrak).
export interface PelaporInput {
  nama: string;
  email?: string;
  telepon?: string;
}

export function getPelapor(): Promise<Pelapor[]> {
  return request<Pelapor[]>("/pelapor");
}

export function createPelapor(input: PelaporInput): Promise<Pelapor> {
  return request<Pelapor>("/pelapor", {
    method: "POST",
    body: JSON.stringify(input), // objek JS harus diubah jadi teks JSON
  });
}