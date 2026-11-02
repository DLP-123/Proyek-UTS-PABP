import type { StatusLaporan } from "../types";

const WARNA: Record<StatusLaporan, { bg: string; text: string }> = {
  Baru: { bg: "#eef2ff ", text: "#4338ca" },
  Diproses: { bg: "#fffbeb", text: "#b45309" },
  Selesai: { bg: "#ecfdfd", text: "#047857" },
  Ditolak: { bg: "#fff1f2", text: "#be123c" },
  }

interface Props {
  status: StatusLaporan | null;
}

export default function StatusBadge({ status }: Props) {
  // Penanganan.status_baru bisa null, jadi tampilkan "-" kalau kosong.
  if (!status) return <span>-</span>;

  const w = WARNA[status];

  return (
    <span
      style={{
        background: w.bg,
        color: w.text,
        padding: "3px 12px",
        borderRadius: 999,
        fontSize: "0.78rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}