import { useEffect, useState } from "react";

interface Champion {
  id: number;
  name: string;
  title: string;
  lore: string;
  iconUrl: string;
}

function App() {
  const [champion, setChampion] = useState<Champion | null>(null);

  useEffect(() => {
    fetch("https://localhost:7062/api/champion")
      .then((res) => res.json())
      .then(setChampion);
  }, []);

  if (!champion) return <div>Loading...</div>;

  return (
    <div style={{ padding: "32px" }}>
      <h1>{champion.name}</h1>
      <div className="retro-panel">
        <h2>{champion.title}</h2>
        <img
          src={champion.iconUrl}
          alt={champion.name}
          style={{ border: "2px solid var(--color-hunger)" }}
        />
        <p>{champion.lore}</p>
      </div>
    </div>
  );
}

export default App;
