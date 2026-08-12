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
    <div>
      <h1>{champion.name}</h1>
      <h2>{champion.title}</h2>
      <img src={champion.iconUrl} alt={champion.name} />
      <p>{champion.lore}</p>
    </div>
  );
}

export default App;
