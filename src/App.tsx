import React from "react";
import { useEffect, useState } from "react";
import "./index.css";

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
  skillOrder: SkillOrderEntry[];
  runes: RunePick[];
  winRate: number;
  gamesAnalyzed: number;
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

interface SkillOrderEntry {
  level: number;
  slot: string;
}

interface RunePick {
  category: string;
  row: number;
  name: string;
  iconUrl: string;
  isSelected: boolean;
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

      <details className="lore-details">
        <summary className="lore-summary">Lore</summary>
        <p>{champion.lore}</p>
      </details>

      <div className="retro-panel">
        <h2>Abilities</h2>
        <div className="abilities-grid">
          {champion.abilities.map((a) => (
            <div key={a.id} className="ability-card">
              <img src={a.iconUrl} alt={a.name} />
              <div>
                <span className="ability-slot">{a.slot}</span>
                <strong>{a.name}</strong>
                <p>{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {champion.buildGuides.map((build) => {
        const slots = ["Q", "W", "E", "R"];
        return (
          <div className="retro-panel" key={build.id}>
            <h2>{build.title}</h2>
            <p>
              Ability Order: {build.abilityOrder} &nbsp;·&nbsp; Source:{" "}
              {build.source}
            </p>

            <div className="build-strip">
              {build.items
                .sort((x, y) => x.orderIndex - y.orderIndex)
                .map((item, i, arr) => (
                  <React.Fragment key={item.id}>
                    <div className="build-item">
                      <img
                        src={item.itemIconUrl}
                        alt={item.itemName}
                        title={item.itemName}
                      />
                      <span>{i + 1}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="build-arrow">→</span>
                    )}
                  </React.Fragment>
                ))}
            </div>

            <h2 style={{ marginTop: "12px" }}>Skill Order</h2>
            <div className="skill-order-table">
              <div />
              {Array.from({ length: 18 }, (_, i) => (
                <div
                  key={`h-${i}`}
                  style={{
                    fontSize: "10px",
                    textAlign: "center",
                    color: "var(--color-border-dark)",
                  }}
                >
                  {i + 1}
                </div>
              ))}
              {slots.map((slot) => {
                const abilityIcon = champion.abilities.find(
                  (a) => a.slot === slot,
                )?.iconUrl;
                return (
                  <React.Fragment key={slot}>
                    <img
                      src={abilityIcon}
                      alt={slot}
                      className="skill-order-icon"
                    />
                    {Array.from({ length: 18 }, (_, i) => {
                      const entry = build.skillOrder.find(
                        (s) => s.slot === slot && s.level === i + 1,
                      );
                      return (
                        <div
                          key={i}
                          className={`skill-order-cell ${entry ? "filled" : ""}`}
                        >
                          {entry ? i + 1 : ""}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
            <h2 style={{ marginTop: "12px" }}>Runes</h2>
            <div className="runes-section">
              <div className="rune-column">
                <h2>Primary</h2>
                <div className="rune-grid">
                  {build.runes
                    .filter((r) => r.category === "Primary")
                    .sort((a, b) => a.row - b.row)
                    .map((r, i) => (
                      <img
                        key={r.name}
                        src={r.iconUrl}
                        alt={r.name}
                        title={r.name}
                        className={`rune-icon ${r.isSelected ? "selected" : ""} ${i === 0 ? "keystone" : ""}`}
                      />
                    ))}
                </div>
              </div>

              <div className="rune-column">
                <h2>Secondary</h2>
                <div className="rune-grid">
                  {build.runes
                    .filter((r) => r.category === "Secondary")
                    .sort((a, b) => a.row - b.row)
                    .map((r) => (
                      <img
                        key={r.name}
                        src={r.iconUrl}
                        alt={r.name}
                        title={r.name}
                        className={`rune-icon ${r.isSelected ? "selected" : ""}`}
                      />
                    ))}
                </div>
              </div>

              <div className="rune-column">
                <h2>Stat Mods</h2>
                <div className="rune-grid">
                  {build.runes
                    .filter((r) => r.category === "StatMod")
                    .sort((a, b) => a.row - b.row)
                    .map((r) => (
                      <img
                        key={r.name}
                        src={r.iconUrl}
                        alt={r.name}
                        title={r.name}
                        className={`stat-mod-icon ${r.isSelected ? "selected" : ""}`}
                      />
                    ))}
                </div>
              </div>
            </div>

            <div className="rune-stats">
              <div className="rune-winrate">{build.winRate}% Win Rate</div>
              <div className="rune-games">
                {build.gamesAnalyzed.toLocaleString()} Games
              </div>
            </div>
          </div>
        );
      })}

      {champion.junglePaths.map((path) => (
        <div className="retro-panel" key={path.id}>
          <h2>{path.title}</h2>
          <div className="jungle-timeline">
            {path.routeSteps.split("->").map((step, i, arr) => (
              <>
                <span className="jungle-step" key={i}>
                  {step.trim()}
                </span>
                {i < arr.length - 1 && <span className="jungle-arrow">→</span>}
              </>
            ))}
          </div>
          <p style={{ marginTop: "8px" }}>
            <em>{path.notes}</em>
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
