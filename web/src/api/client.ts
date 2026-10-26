// Alamat dasar API dibaca dari .env. Jika tidak ada, pakai nilai bawaan.
// Nilai bawaan ini penting karena .env tidak masuk git, jadi anggota tim lain tidak punya file itu.
const BASE_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Class error khusus supaya UI bisa membaca kode status (400, 404, 409, ...).
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Satu fungsi untuk semua request. <T> adalah tipe data yang diharapkan kembali.
export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    // fetch hanya melempar error jika jaringan gagal (server mati, salah port).
    throw new ApiError(
      0,
      "Tidak bisa terhubung ke server. Pastikan API menyala di port 3000."
    );
  }

  // Jika body bukan JSON yang valid, hasilnya null, bukan crash.
  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    // Sesuai kontrak: pesan kesalahan ada di field "error".
    throw new ApiError(
      response.status,
      body?.error ?? body?.message ?? "Terjadi kesalahan pada server."
    );
  }

  return body.data as T;
}