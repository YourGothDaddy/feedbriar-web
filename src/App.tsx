import { useEffect, useState } from "react";

interface Ability {
  id: number;
  slot: string;
  name: string;
  description: string;
  iconUrl: string;
}

interface BuildItem {
  id: number;
  itemName: string;
  itemIconUrl: string;
  orderIndex: number;
}

interface BuildGuide {
  id: number;
  title: string;
  abilityOrder: string;
  source: string;
  items: BuildItem[];
}

interface JunglePath {
  id: number;
  title: string;
  routeSteps: string;
  notes: string;
}

interface Champion {
  id: number;
  name: string;
  title: string;
  lore: string;
  iconUrl: string;
  abilities: Ability[];
  buildGuides: BuildGuide[];
  junglePaths: JunglePath[];
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
    <div className="page-container">
      <div className="champion-header">
        <img src={champion.iconUrl} alt={champion.name} />
        <div>
          <h1>{champion.name}</h1>
          <h2>{champion.title}</h2>
        </div>
      </div>

      <div className="retro-panel">
        <p>{champion.lore}</p>
      </div>

      <div className="retro-panel">
        <h2>Abilities</h2>
        {champion.abilities.map((a) => (
          <div key={a.id} className="ability-row">
            <img src={a.iconUrl} alt={a.name} />
            <div>
              <span className="ability-slot">{a.slot}</span>
              <strong>{a.name}</strong>
              <p>{a.description}</p>
            </div>
          </div>
        ))}
      </div>

      {champion.buildGuides.map((build) => (
        <div className="retro-panel" key={build.id}>
          <h2>{build.title}</h2>
          <p>
            Ability Order: {build.abilityOrder} &nbsp;·&nbsp; Source:{" "}
            {build.source}
          </p>
          <div className="build-items">
            {build.items
              .sort((x, y) => x.orderIndex - y.orderIndex)
              .map((item) => (
                <img
                  key={item.id}
                  src={item.itemIconUrl}
                  alt={item.itemName}
                  title={item.itemName}
                />
              ))}
          </div>
        </div>
      ))}

      {champion.junglePaths.map((path) => (
        <div className="retro-panel" key={path.id}>
          <h2>{path.title}</h2>
          <p>{path.routeSteps}</p>
          <p>
            <em>{path.notes}</em>
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
