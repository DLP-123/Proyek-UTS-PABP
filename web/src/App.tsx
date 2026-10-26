import { useState } from "react";
import LaporanList from "./pages/LaporanList";
import LaporanForm from "./pages/LaporanForm";
import PelaporPage from "./pages/PelaporPage";

type Halaman = "laporan" | "buat" | "pelapor";

function App() {
  const [halaman, setHalaman] = useState<Halaman>("laporan");

  return (
    <div style={{ padding: 16 }}>
      <h1>Sistem Pelaporan Keluhan</h1>
      <nav style={{ marginBottom: 16 }}>
        <button onClick={() => setHalaman("laporan")}>Daftar Laporan</button>{" "}
        <button onClick={() => setHalaman("buat")}>Buat Laporan</button>{" "}
        <button onClick={() => setHalaman("pelapor")}>Pelapor</button>
      </nav>

      {halaman === "laporan" && <LaporanList />}
      {halaman === "buat" && (
        <LaporanForm onSukses={() => setHalaman("laporan")} />
      )}
      {halaman === "pelapor" && <PelaporPage />}
    </div>
  );
}

export default App;