import { useState } from "react";
import LaporanList from "./pages/LaporanList";
import PelaporPage from "./pages/PelaporPage";

type Halaman = "laporan" | "pelapor";

function App() {
  const [halaman, setHalaman] = useState<Halaman>("laporan");

  return (
    <div style={{ padding: 16 }}>
      <h1>Sistem Pelaporan Keluhan</h1>
      <nav style={{ marginBottom: 16 }}>
        <button onClick={() => setHalaman("laporan")}>Laporan</button>{" "}
        <button onClick={() => setHalaman("pelapor")}>Pelapor</button>
      </nav>
      {halaman === "laporan" ? <LaporanList /> : <PelaporPage />}
    </div>
  );
}

export default App;