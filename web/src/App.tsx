import { useState } from "react";
import LaporanList from "./pages/LaporanList";
import LaporanForm from "./pages/LaporanForm";
import LaporanDetail from "./pages/LaporanDetail";
import PelaporPage from "./pages/PelaporPage";

type Halaman = "laporan" | "buat" | "pelapor" | "detail";

function App() {
  const [halaman, setHalaman] = useState<Halaman>("laporan");
  const [detailId, setDetailId] = useState<number | null>(null);

  return (
    <div style={{ padding: 16 }}>
      <h1>Sistem Pelaporan Keluhan</h1>
      <nav style={{ marginBottom: 16 }}>
        <button onClick={() => setHalaman("laporan")}>Daftar Laporan</button>{" "}
        <button onClick={() => setHalaman("buat")}>Buat Laporan</button>{" "}
        <button onClick={() => setHalaman("pelapor")}>Pelapor</button>
      </nav>

      {halaman === "laporan" && (
        <LaporanList
          onDetail={(id) => {
            setDetailId(id);
            setHalaman("detail");
          }}
        />
      )}
      {halaman === "buat" && (
        <LaporanForm onSukses={() => setHalaman("laporan")} />
      )}
      {halaman === "pelapor" && <PelaporPage />}
      {halaman === "detail" && detailId !== null && (
        <LaporanDetail id={detailId} onKembali={() => setHalaman("laporan")} />
      )}
    </div>
  );
}

export default App;