import { useEffect } from "react";
import { getLaporan } from "./api/laporan";

function App() {
  useEffect(() => {
    getLaporan()
      .then((data) => console.log("Data laporan:", data))
      .catch((err) => console.error("Gagal:", err));
  }, []);

  return <h1>Tes koneksi API</h1>;
}

export default App;