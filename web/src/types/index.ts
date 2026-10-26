// Union type: variabel hanya boleh berisi salah satu dari empat string ini.
export type StatusLaporan = "Baru" | "Diproses" | "Selesai" | "Ditolak";

export interface Pelapor {
  id: number;
  nama: string;
  email: string | null;
  telepon: string | null;
  created_at: string;
  updated_at: string;
}

export interface Laporan {
  id: number;
  pelapor_id: number;
  judul: string;
  deskripsi: string | null;
  kategori: string | null;
  lokasi: string | null;
  status: StatusLaporan;
  created_at: string;
  updated_at: string;
}

export interface Penanganan {
  id: number;
  laporan_id: number;
  petugas: string;
  catatan: string | null;
  status_baru: StatusLaporan | null;
  created_at: string;
}