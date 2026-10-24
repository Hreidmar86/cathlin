import React, { useEffect, useRef, useState } from "react";
import { drawWorld, makeWorld } from "./game.js";

export function Icon({ name, size = 22, ...props }) {
  const paths = {
    leaf: (
      <>
        <path d="M20 4C9 2 3 7 5 15c8 5 16-1 15-11Z" />
        <path d="m4 21 11-12" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16 8-3 5-5 3 3-5Z" />
      </>
    ),
    bag: (
      <>
        <rect x="5" y="7" width="14" height="15" rx="4" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2M8 14h8v5H8zM5 11H3v7h2m14-7h2v7h-2" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v16M3 4c4-1 6 0 9 1 3-1 5-2 9-1v15c-4-1-6 0-9 2-3-2-5-3-9-2Z" />
      </>
    ),
    map: (
      <>
        <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m9 3 1-1h4l1 3 3 1 3 1v4l-2 2 1 3-3 3-3-1-2 2-4-1-1-3-3-1v-4l2-2V5Z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    heart: <path d="M12 21 3 12C-3 4 7-1 12 6 17-1 27 4 21 12Z" />,
    food: (
      <>
        <path d="M6 2v7m4-7v7M3 2v6c0 5 10 5 10 0V2M8 12v10m12 0V2c-6 4-6 11 0 11" />
      </>
    ),
    fire: (
      <path d="M12 2c2 7-5 7-3 12 2-1 3-3 3-5 9 6 9 13 1 13C1 22 2 11 6 7c-1 5 1 5 2 6-1-5 4-6 4-11Z" />
    ),
    wood: (
      <>
        <path d="m5 19 12-12M3 16l5 5 13-13-5-5Z" />
        <path d="m6 14 5 5m3-13 5 5" />
      </>
    ),
    stone: <path d="m3 17 2-9 7-5 8 5 2 9-8 5Z" />,
    berry: (
      <>
        <circle cx="8" cy="14" r="5" />
        <circle cx="16" cy="14" r="5" />
        <circle cx="12" cy="19" r="4" />
        <path d="M12 10V3m0 3c1-4 5-4 7-3-1 3-4 4-7 3" />
      </>
    ),
    tent: (
      <>
        <path d="m2 21 10-18 10 18Zm5 0 5-10 5 10M10 2l4 3" />
      </>
    ),
    arrow: <path d="m9 5 7 7-7 7" />,
    check: <path d="m5 12 5 5L20 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    sound: (
      <>
        <path d="m3 9 5-1 5-5v18l-5-5-5-1Zm14-2c3 3 3 7 0 10m3-13c5 5 5 11 0 16" />
      </>
    ),
    flag: (
      <>
        <path d="M5 22V3c5-5 9 5 15 0v10c-6 5-10-5-15 0" />
      </>
    ),
    moon: <path d="M21 14A9 9 0 0 1 10 3c-10 2-9 17 2 18 5 0 8-3 9-7Z" />,
    pause: (
      <>
        <path d="M8 5v14M16 5v14" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9c0-4 7-4 6 0 0 2-3 2-3 5m0 3v1" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name] || paths.leaf}
    </svg>
  );
}
const recipes = [
  {
    id: "fire",
    name: "Lägereld",
    desc: "En varm och trygg plats.",
    icon: "fire",
    cost: { wood: 5, stone: 3 },
  },
  {
    id: "tent",
    name: "Tält",
    desc: "Vila dig till en ny dag.",
    icon: "tent",
    cost: { wood: 8, stone: 2 },
  },
  {
    id: "torch",
    name: "Fackla",
    desc: "Ta med ljuset på äventyr.",
    icon: "fire",
    cost: { wood: 3, berry: 1 },
  },
  {
    id: "sling",
    name: "Slangbella",
    desc: "Skräm bort skogens busar.",
    icon: "compass",
    cost: { wood: 5, stone: 4 },
  },
  {
    id: "signal",
    name: "Signalmast",
    desc: "Visa räddningen var du är.",
    icon: "flag",
    cost: { wood: 12, stone: 6 },
  },
];
const freshGame = () => ({
  x: 540,
  y: 470,
  hp: 100,
  hunger: 92,
  warmth: 100,
  wood: 0,
  stone: 0,
  berry: 0,
  built: [],
  day: 1,
  time: 0,
  guard: 5,
  won: false,
  visited: false,
  collected: 0,
});
const initial = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("vildmarken-save-v1"));
    if (
      saved &&
      Array.isArray(saved.built) &&
      [
        "x",
        "y",
        "hp",
        "hunger",
        "warmth",
        "wood",
        "stone",
        "berry",
        "day",
        "time",
        "guard",
        "collected",
      ].every((k) => Number.isFinite(saved[k]))
    )
      return { ...freshGame(), ...saved };
  } catch {}
  return freshGame();
};
const names = { wood: "trä", stone: "sten", berry: "bär" };
export default function App() {
  const [game, setGame] = useState(initial),
    [tab, setTab] = useState("adventure"),
    [modal, setModal] = useState(null),
    [paused, setPaused] = useState(false),
    [toast, setToast] = useState(
      "Välkommen till skogen! Ditt äventyr börjar här.",
    ),
    [selected, setSelected] = useState("wood"),
    [sound, setSound] = useState(true);
  const canvas = useRef(),
    keys = useRef({}),
    world = useRef(makeWorld()),
    live = useRef(game),
    target = useRef(null),
    action = useRef(() => {}),
    soundRef = useRef(null),
    escapeAction = useRef(() => {});
  live.current = game;
  escapeAction.current = () => {
    if (modal) {
      setModal(null);
      setTab("adventure");
    } else setPaused((v) => !v);
  };
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem("vildmarken-save-v1", JSON.stringify(game));
      } catch {}
    }, 400);
    return () => clearTimeout(id);
  }, [game]);
  const night = game.time > 120,
    dusk = game.time > 95 && !night;
  function notify(t) {
    setToast(t);
  }
  function chime() {
    if (!sound) return;
    try {
      const a =
        soundRef.current ||
        (soundRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )());
      const o = a.createOscillator(),
        g = a.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(580, a.currentTime);
      o.frequency.exponentialRampToValueAtTime(880, a.currentTime + 0.12);
      g.gain.setValueAtTime(0.06, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.25);
      o.connect(g).connect(a.destination);
      o.start();
      o.stop(a.currentTime + 0.26);
    } catch {}
  }
  function interact() {
    const s = live.current;
    if (paused || modal || s.won) return;
    const d = (x, y) => Math.hypot(s.x - x, s.y - y);
    if (d(550, 430) < 75 && s.built.includes("fire")) {
      if (s.berry) {
        setGame((v) => ({
          ...v,
          berry: v.berry - 1,
          hunger: Math.min(100, v.hunger + 30),
          hp: Math.min(100, v.hp + 10),
        }));
        notify("Mums! Varma bär ger ny energi.");
        chime();
        return;
      }
      notify("Du värmer dig vid elden. Plocka bär för att laga mat.");
      return;
    }
    if (s.built.includes("sling") && s.time > 120) {
      const enemy = world.current.enemies.find(
        (e) =>
          d(e.x, e.y) < 110 &&
          (!e.scaredUntil || e.scaredUntil < performance.now()),
      );
      if (enemy) {
        enemy.scaredUntil = performance.now() + 12000;
        notify("Stjärnsmäll! Skogsbusen springer iväg en stund.");
        chime();
        return;
      }
    }
    if (d(850, 130) < 100) {
      if (!s.built.includes("sling")) {
        notify("Väktaren vaktar bergspasset. Bygg en slangbella först!");
        return;
      }
      if (s.guard > 0) {
        setGame((v) => ({ ...v, guard: v.guard - 1, visited: true }));
        notify(
          s.guard === 1
            ? "Väktaren är lugn! Bygg en signalmast och återvänd hit."
            : `Fullträff! ${s.guard - 1} träffar kvar. Håll dig i rörelse!`,
        );
        chime();
        return;
      }
      if (s.built.includes("signal")) {
        setGame((v) => ({ ...v, won: true }));
        setModal("win");
        chime();
        return;
      }
      notify("Vägen är fri! Bygg en signalmast för att kalla på flygplanet.");
      return;
    }
    const n = world.current.resources
      .filter((r) => !r.taken && d(r.x, r.y) < 66)
      .sort((a, b) => d(a.x, a.y) - d(b.x, b.y))[0];
    if (n) {
      n.taken = true;
      n.regrow = performance.now() + 45000;
      setGame((v) => ({
        ...v,
        [n.type]: v[n.type] + (n.type === "wood" ? 3 : 2),
        collected: v.collected + 1,
      }));
      notify(`+${n.type === "wood" ? 3 : 2} ${names[n.type]} i ryggsäcken`);
      chime();
    } else notify("Gå nära pinnar, stenar eller bär och tryck E.");
  }
  action.current = interact;
  function craft(r) {
    if (game.built.includes(r.id)) return;
    if (!Object.entries(r.cost).every(([k, n]) => game[k] >= n)) {
      notify("Samla lite fler resurser först. Du hittar dem i skogen!");
      return;
    }
    if (r.id !== "fire" && !game.built.includes("fire")) {
      notify("Börja med att bygga din lägereld.");
      return;
    }
    setGame((v) => {
      let next = { ...v, built: [...v.built, r.id] };
      Object.entries(r.cost).forEach(([k, n]) => (next[k] -= n));
      return next;
    });
    chime();
    notify(
      `${r.name} är klar! ${r.id === "tent" ? "Nu kan du sova tryggt i lägret." : "Bra jobbat, äventyrare!"}`,
    );
  }
  function eat() {
    if (game.berry < 1) {
      notify("Plocka bär i skogen först.");
      return;
    }
    setGame((v) => ({
      ...v,
      berry: v.berry - 1,
      hunger: Math.min(100, v.hunger + 20),
    }));
    notify("Ett litet skogsmellanmål. +20 mättnad");
    chime();
  }
  function sleep() {
    if (!game.built.includes("tent")) {
      notify("Bygg ett tält för att kunna sova.");
      return;
    }
    if (Math.hypot(game.x - 550, game.y - 430) > 130) {
      notify("Återvänd till lägret för att sova.");
      return;
    }
    setGame((v) => ({ ...v, time: 0, day: v.day + 1, hp: 100, warmth: 100 }));
    notify("God morgon! Du är utvilad och redo för en ny dag.");
    chime();
  }
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const down = (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      )
        e.preventDefault();
      keys.current[e.key.toLowerCase()] = true;
      if (e.repeat) return;
      if (e.key.toLowerCase() === "e" || e.key === " ") action.current();
      if (e.key === "Escape") escapeAction.current();
    };
    const up = (e) => (keys.current[e.key.toLowerCase()] = false);
    const blur = () => {
      keys.current = {};
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);
  useEffect(() => {
    let frame,
      last = 0,
      acc = 0;
    const tick = (t) => {
      const dt = Math.min((t - last) / 1000 || 0, 0.04);
      last = t;
      const s = live.current;
      if (!paused && !modal && !s.won) {
        let dx =
            (keys.current.d || keys.current.arrowright ? 1 : 0) -
            (keys.current.a || keys.current.arrowleft ? 1 : 0),
          dy =
            (keys.current.s || keys.current.arrowdown ? 1 : 0) -
            (keys.current.w || keys.current.arrowup ? 1 : 0);
        if (dx || dy) target.current = null;
        else if (target.current) {
          dx = target.current.x - s.x;
          dy = target.current.y - s.y;
          if (Math.hypot(dx, dy) < 5) {
            target.current = null;
            dx = dy = 0;
          }
        }
        const len = Math.hypot(dx, dy),
          sneak = keys.current.shift,
          speed = sneak ? 62 : 125;
        let x = s.x + (len ? (dx / len) * speed * dt : 0),
          y = s.y + (len ? (dy / len) * speed * dt : 0);
        x = Math.max(35, Math.min(1065, x));
        y = Math.max(75, Math.min(730, y));
        if (x > 840 && y > 460) {
          x = s.x;
          y = s.y;
          target.current = null;
        }
        if (x !== s.x || y !== s.y) {
          live.current = { ...s, x, y };
          setGame(live.current);
        }
        acc += dt;
        if (acc >= 0.5) {
          acc = 0;
          setGame((v) => {
            let n = {
              ...v,
              time: v.time + 0.5,
              hunger: Math.max(0, v.hunger - 0.055),
            };
            if (n.time > 180) {
              n.time = 0;
              n.day++;
            }
            const safe =
              Math.hypot(v.x - 550, v.y - 430) < 115 &&
              v.built.includes("fire");
            n.warmth = Math.max(
              0,
              Math.min(
                100,
                v.warmth +
                  (n.time > 120 && !safe && !v.built.includes("torch")
                    ? -0.8
                    : 1),
              ),
            );
            if (safe) n.hp = Math.min(100, n.hp + 1);
            if (n.hunger === 0 || n.warmth === 0) n.hp -= 1;
            if (n.time > 120 && !safe && !v.built.includes("torch") && !sneak) {
              const enemy = world.current.enemies.find(
                (e) =>
                  Math.hypot(v.x - e.x, v.y - e.y) < 40 &&
                  (!e.scaredUntil || e.scaredUntil < performance.now()),
              );
              if (enemy) n.hp -= 3;
            }
            if (v.guard > 0 && Math.hypot(v.x - 850, v.y - 130) < 65) n.hp -= 1;
            if (n.hp <= 0) {
              n = { ...n, x: 540, y: 470, hp: 100, hunger: 65, warmth: 100 };
              notify("Du vaknade tryggt i lägret. Alla dina saker finns kvar!");
            }
            return n;
          });
        }
        for (const r of world.current.resources)
          if (r.taken && t > r.regrow) r.taken = false;
        for (const e of world.current.enemies) {
          const g = live.current;
          const chase =
            (!e.scaredUntil || t > e.scaredUntil) &&
            g.time > 120 &&
            !keys.current.shift &&
            !g.built.includes("torch") &&
            Math.hypot(g.x - 550, g.y - 430) > 120 &&
            Math.hypot(g.x - e.x, g.y - e.y) < 160;
          const ex = chase ? g.x : e.homeX + Math.sin(t / 3000 + e.homeY) * 45,
            ey = chase ? g.y : e.homeY + Math.cos(t / 4000 + e.homeX) * 30;
          const dist = Math.hypot(ex - e.x, ey - e.y);
          if (dist > 2) {
            e.x += ((ex - e.x) / dist) * dt * 28;
            e.y += ((ey - e.y) / dist) * dt * 28;
          }
        }
      }
      drawWorld(canvas.current, world.current, live.current, t, {
        night: live.current.time > 120,
        sneak: !!keys.current.shift,
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, modal]);
  const fire = game.built.includes("fire"),
    tent = game.built.includes("tent");
  const quests = [
    {
      title: "Samla skogens gåvor",
      desc: "Hitta trä, sten och något gott att äta.",
      done: game.collected >= 3,
    },
    {
      title: "En plats att kalla hemma",
      desc: "Bygg din första lägereld.",
      done: fire,
    },
    {
      title: "Sov under stjärnorna",
      desc: "Bygg ett tält vid ditt läger.",
      done: tent,
    },
    {
      title: "Hemåt, äventyrare",
      desc: "Möt väktaren och signalera räddningen.",
      done: game.won,
    },
  ];
  const currentQuest = quests.find((q) => !q.done) || quests[3];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setTab("adventure");
          }}
        >
          <div className="brand-mark">
            <Icon name="leaf" size={30} />
          </div>
          <span>
            VILDMARKEN<small>RESAN HEM</small>
          </span>
        </a>
        <div className="sidebar-label">DITT ÄVENTYR</div>
        <nav>
          {[
            ["adventure", "compass", "Äventyret"],
            ["bag", "bag", "Ryggsäcken"],
            ["journal", "book", "Dagboken"],
            ["map", "map", "Världskartan"],
          ].map(([id, icon, title]) => (
            <button
              key={id}
              aria-label={title}
              className={tab === id ? "nav-item active" : "nav-item"}
              onClick={() => {
                setTab(id);
                if (id !== "adventure") setModal(id);
              }}
            >
              <Icon name={icon} />
              <span>{title}</span>
              {id === "adventure" && <span className="nav-dot" />}
              {id === "bag" && (
                <small>{game.wood + game.stone + game.berry}</small>
              )}
            </button>
          ))}
        </nav>
        <div className="journey-card">
          <div className="journey-illustration">
            <span>✦</span>
            <Icon name="tent" size={46} />
            <span>✧</span>
          </div>
          <span className="eyebrow">ETT STEG I TAGET</span>
          <h3>Alla stigar leder hem.</h3>
          <p>Ta din tid. Skogen har mycket att berätta.</p>
          <div className="journey-line">
            <i
              style={{
                width: `${(quests.filter((q) => q.done).length / 4) * 100}%`,
              }}
            />
          </div>
          <small>{quests.filter((q) => q.done).length} av 4 milstolpar</small>
        </div>
        <div className="sidebar-bottom">
          <button onClick={() => setModal("settings")}>
            <Icon name="settings" />
            Inställningar
          </button>
          <button onClick={() => setModal("help")}>
            <Icon name="help" />
            Så spelar du
          </button>
          <div className="profile">
            <div className="avatar">E</div>
            <span>
              En liten äventyrare<small>En stor värld väntar</small>
            </span>
            <span className="online" />
          </div>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <div className="breadcrumb">
            Ditt äventyr <span>/</span> <strong>Gläntan</strong>
          </div>
          <div className="topbar-right">
            <span className="saved">
              <i /> Äventyret sparas här
            </span>
            <button
              className="icon-button"
              aria-label="Ljud på eller av"
              onClick={() => setSound((v) => !v)}
              style={{ opacity: sound ? 1 : 0.4 }}
            >
              <Icon name="sound" size={19} />
            </button>
            <button
              className="avatar small"
              onClick={() => setModal("help")}
              aria-label="Spelhjälp"
            >
              E
            </button>
          </div>
        </header>
        <div className="main-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow green">
                <span />{" "}
                {game.won
                  ? "RESAN ÄR FULLBORDAD"
                  : game.built.includes("sling")
                    ? "KAPITEL 3 · VÄGEN HEM"
                    : fire
                      ? "KAPITEL 2 · ETT HEM I SKOGEN"
                      : "KAPITEL 1 · DEN VILSNE ÄVENTYRAREN"}
              </div>
              <h1>
                Ditt äventyr börjar här<span>.</span>
              </h1>
              <p>En stor skog. Ett litet läger. Och en väg hem.</p>
            </div>
            <div className="day-chip">
              <Icon name={night ? "moon" : "sun"} size={24} />
              <div>
                Dag {game.day}
                <small>
                  {night
                    ? "Stjärnklar natt"
                    : dusk
                      ? "Solen går ner"
                      : "En stilla förmiddag"}
                </small>
              </div>
            </div>
          </section>
          <div className="game-layout">
            <section className="play-area">
              <div className="scene">
                <canvas
                  ref={canvas}
                  width="1100"
                  height="760"
                  aria-label="Spelvärld. Använd WASD eller piltangenter för att gå och E för att samla."
                  onPointerDown={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    target.current = {
                      x: ((e.clientX - r.left) / r.width) * 1100,
                      y: ((e.clientY - r.top) / r.height) * 760,
                    };
                  }}
                />
                <div className="location">
                  <span className="location-icon">
                    <Icon name="leaf" size={18} />
                  </span>
                  <div>
                    Den gröna gläntan<small>En trygg plats att börja på</small>
                  </div>
                </div>
                <div className="scene-actions">
                  <button
                    className="scene-icon"
                    aria-label={paused ? "Fortsätt" : "Pausa"}
                    onClick={() => setPaused((v) => !v)}
                  >
                    <Icon name={paused ? "arrow" : "pause"} size={17} />
                  </button>
                  <button
                    className="scene-icon"
                    aria-label="Öppna karta"
                    onClick={() => {
                      setTab("map");
                      setModal("map");
                    }}
                  >
                    <Icon name="map" size={18} />
                  </button>
                </div>
                <div className="north">
                  <span>N</span>
                  <Icon name="compass" size={37} />
                </div>
                <div className="world-label camp-label">
                  <span className="tiny-dot" /> Ditt läger
                </div>
                <div className="world-label forest-label">VISKSKOGEN</div>
                <div className="world-label mountain-label">↑ BERGSPASSET</div>
                {paused && (
                  <div className="pause-overlay">
                    <Icon name="leaf" size={40} />
                    <h2>En liten andningspaus</h2>
                    <button
                      className="primary"
                      onClick={() => setPaused(false)}
                    >
                      Fortsätt äventyret
                    </button>
                  </div>
                )}
                {toast && (
                  <div className="toast" role="status">
                    <Icon name="leaf" size={18} />
                    {toast}
                  </div>
                )}
                <div className="scene-bottom">
                  <div className="safe-tag">
                    <span />{" "}
                    {Math.hypot(game.x - 550, game.y - 430) < 150
                      ? "Du är nära lägret"
                      : "På upptäcktsfärd"}
                  </div>
                  <button className="interact-button" onClick={interact}>
                    <kbd>E</kbd> Samla / använd
                  </button>
                </div>
              </div>
              <div className="game-toolbar">
                <div className="key-help">
                  <span>
                    <kbd>W A S D</kbd> Flytta
                  </span>
                  <span>
                    <kbd>E</kbd> Samla
                  </span>
                  <span>
                    <kbd>SHIFT</kbd> Smyg
                  </span>
                </div>
                <span className="click-help">
                  eller klicka för att gå <Icon name="compass" size={15} />
                </span>
              </div>
              <div className="below-game">
                <div className="tip-icon">
                  <Icon name={night ? "moon" : "sun"} size={24} />
                </div>
                <div>
                  <strong>
                    {night
                      ? "Lite mörker, mycket mod."
                      : "Små steg blir stora äventyr."}
                  </strong>
                  <p>
                    {night
                      ? "Håll dig nära elden eller smyg med Shift. Facklan håller busarna borta."
                      : "Samla det du hittar och bygg ett varmt läger innan natten kommer."}
                  </p>
                </div>
                <span className="tip-pill">SKOGENS LILLA TIPS</span>
              </div>
            </section>
            <aside className="right-panel">
              <section className="status-card">
                <div className="card-heading">
                  <h2>Hur mår du?</h2>
                  <span className="live-dot" />
                </div>
                {[
                  ["hp", "heart", "Hälsa", "#ca7970"],
                  ["hunger", "food", "Mättnad", "#d3a45f"],
                  ["warmth", "fire", "Värme", "#7d9b79"],
                ].map(([id, ic, label, c]) => (
                  <div className="gauge" key={id}>
                    <div>
                      <span>
                        <Icon name={ic} size={17} />
                        {label}
                      </span>
                      <strong>
                        {Math.round(game[id])}
                        <small> / 100</small>
                      </strong>
                    </div>
                    <div className="gauge-track">
                      <i style={{ width: `${game[id]}%`, background: c }} />
                    </div>
                  </div>
                ))}
                <div className="status-note">
                  <Icon name="leaf" size={14} />{" "}
                  {game.hp > 65
                    ? "Du mår fint. Njut av äventyret!"
                    : "Lite vila och mat hjälper dig."}
                </div>
              </section>
              <section className="quest-card">
                <div className="card-heading">
                  <h2>Din nästa upptäckt</h2>
                  <Icon name="flag" size={17} />
                </div>
                <div className="quest-chapter">HITTA DIN PLATS I SKOGEN</div>
                <h3>{currentQuest.title}</h3>
                <p>{currentQuest.desc}</p>
                <div className="quest-checks">
                  {quests.slice(0, 3).map((q) => (
                    <div key={q.title} className={q.done ? "done" : ""}>
                      <span>{q.done && <Icon name="check" size={11} />}</span>
                      {q.title}
                    </div>
                  ))}
                </div>
                <button
                  className="text-button"
                  onClick={() => {
                    setTab("journal");
                    setModal("journal");
                  }}
                >
                  Öppna dagboken <Icon name="arrow" size={15} />
                </button>
              </section>
              <section className="craft-card">
                <div className="card-heading">
                  <h2>Gör lägret till ditt</h2>
                  <Icon name="tent" size={20} />
                </div>
                <p>Lite resurser. Lite fantasi.</p>
                {recipes.slice(0, 2).map((r) => (
                  <button
                    className={`recipe ${game.built.includes(r.id) ? "built" : ""}`}
                    key={r.id}
                    onClick={() => craft(r)}
                  >
                    <span className={`recipe-icon ${r.id}`}>
                      <Icon name={r.icon} size={29} />
                    </span>
                    <span className="recipe-content">
                      <strong>{r.name}</strong>
                      <span>
                        {Object.entries(r.cost).map(([k, n]) => (
                          <span
                            className={game[k] >= n ? "enough" : ""}
                            key={k}
                          >
                            <Icon name={k} size={12} />
                            {game[k]}/{n}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="recipe-plus">
                      {game.built.includes(r.id) ? (
                        <Icon name="check" size={18} />
                      ) : (
                        "+"
                      )}
                    </span>
                  </button>
                ))}
                <button
                  className="all-recipes"
                  onClick={() => setModal("craft")}
                >
                  Alla byggrecept <Icon name="arrow" size={15} />
                </button>
              </section>
            </aside>
          </div>
          <footer className="bottom-bar">
            <div className="inventory">
              <span className="inventory-title">
                <Icon name="bag" size={17} /> I din ryggsäck
              </span>
              {["wood", "stone", "berry"].map((k) => (
                <button
                  key={k}
                  className={`inventory-slot ${selected === k ? "selected" : ""}`}
                  onClick={() => {
                    setSelected(k);
                    if (k === "berry") eat();
                  }}
                  title={k === "berry" ? "Ät bär" : names[k]}
                >
                  <Icon name={k} size={21} />
                  <strong>{game[k]}</strong>
                  <span>{names[k]}</span>
                </button>
              ))}
              <button
                className="more-inventory"
                onClick={() => setModal("bag")}
              >
                •••
              </button>
            </div>
            <button
              className="camp-button"
              onClick={() => {
                target.current = { x: 540, y: 475 };
                notify("På väg till ditt läger.");
              }}
            >
              <Icon name="tent" size={19} /> Till lägret{" "}
              <Icon name="arrow" size={15} />
            </button>
          </footer>
          <div className="page-footer">
            <span>
              <Icon name="leaf" size={13} /> Äventyr i din egen takt.
            </span>
            <span>Ingen brådska. Du hittar hem.</span>
          </div>
        </div>
      </main>
      {modal && (
        <div
          className="modal-backdrop"
          onClick={() => {
            setModal(null);
            setTab("adventure");
          }}
        >
          <section
            className={`modal ${modal === "map" ? "map-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Äventyrspanel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close icon-button"
              aria-label="Stäng"
              onClick={() => {
                setModal(null);
                setTab("adventure");
              }}
            >
              <Icon name="close" />
            </button>
            {modal === "craft" && (
              <>
                <div className="modal-eyebrow">DITT LILLA HEM</div>
                <h2>Bygg något fint.</h2>
                <p>Resurser från skogen blir början på något stort.</p>
                <div className="full-recipes">
                  {recipes.map((r) => (
                    <div className="full-recipe" key={r.id}>
                      <span className="recipe-icon">
                        <Icon name={r.icon} size={30} />
                      </span>
                      <div>
                        <h3>{r.name}</h3>
                        <p>{r.desc}</p>
                        <small>
                          {Object.entries(r.cost)
                            .map(([k, n]) => `${n} ${names[k]}`)
                            .join(" · ")}
                        </small>
                      </div>
                      <button
                        className="primary"
                        disabled={
                          game.built.includes(r.id) ||
                          !Object.entries(r.cost).every(
                            ([k, n]) => game[k] >= n,
                          )
                        }
                        onClick={() => craft(r)}
                      >
                        {game.built.includes(r.id) ? "Byggd ✓" : "Bygg"}
                      </button>
                    </div>
                  ))}
                </div>
                {tent && (
                  <button className="secondary" onClick={sleep}>
                    Sov till nästa morgon
                  </button>
                )}
              </>
            )}
            {modal === "bag" && (
              <>
                <div className="modal-eyebrow">TA MED DET VIKTIGA</div>
                <h2>Din ryggsäck</h2>
                <p>Alla små fynd kan bli till något användbart.</p>
                <div className="bag-grid">
                  {["wood", "stone", "berry"].map((k) => (
                    <div key={k}>
                      <Icon name={k} size={42} />
                      <h3>
                        {game[k]} {names[k]}
                      </h3>
                      <p>
                        {k === "wood"
                          ? "Till eld, tält och verktyg."
                          : k === "stone"
                            ? "Stadiga stenar för ditt läger."
                            : "Ett sött litet energipaket."}
                      </p>
                      {k === "berry" && (
                        <button className="secondary" onClick={eat}>
                          Ät ett bär
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <h3>Dina skapelser</h3>
                <p>
                  {game.built.length
                    ? recipes
                        .filter((r) => game.built.includes(r.id))
                        .map((r) => r.name)
                        .join(" · ")
                    : "Här är det tomt än så länge. Bygg din första lägereld!"}
                </p>
                <button className="primary" onClick={() => setModal("craft")}>
                  Öppna byggrecept
                </button>
              </>
            )}
            {modal === "journal" && (
              <>
                <div className="modal-eyebrow">EN BERÄTTELSE OM MOD</div>
                <h2>Din resa hem</h2>
                <p>
                  Du vaknade i en främmande skog. Men även den längsta resan
                  börjar med ett litet steg.
                </p>
                <div className="journal-list">
                  {quests.map((q, i) => (
                    <div key={q.title} className={q.done ? "done" : ""}>
                      <span>
                        {q.done ? <Icon name="check" /> : `0${i + 1}`}
                      </span>
                      <div>
                        <h3>{q.title}</h3>
                        <p>{q.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="journal-note">
                  Bortom skogen ligger bergspasset i nordost. Skaffa en
                  slangbella, lugna väktaren med fem träffar och bygg en
                  signalmast. Där uppe kan du kalla på räddningen.
                </div>
              </>
            )}
            {modal === "map" && (
              <>
                <div className="modal-eyebrow">FÖLJ DIN NYFIKENHET</div>
                <h2>En värld att upptäcka</h2>
                <div className="illustrated-map">
                  <div className="map-mountains">△ ▲ △</div>
                  <button
                    className="map-point mountain-point"
                    onClick={() => {
                      target.current = { x: 835, y: 190 };
                      setModal(null);
                      setTab("adventure");
                    }}
                  >
                    <Icon name="flag" />
                    Bergspasset<small>Skogens väktare</small>
                  </button>
                  <div className="map-trees">
                    ♠ ♠ ♠<br />♠ ♠ ♠ ♠<br />♠ ♠ ♠
                  </div>
                  <button
                    className="map-point camp-point"
                    onClick={() => {
                      target.current = { x: 540, y: 475 };
                      setModal(null);
                      setTab("adventure");
                    }}
                  >
                    <Icon name="tent" />
                    Ditt läger<small>Den gröna gläntan</small>
                  </button>
                  <div className="map-pond" />
                  <span
                    className="map-you"
                    style={{
                      left: `${(game.x / 1100) * 100}%`,
                      top: `${(game.y / 760) * 100}%`,
                    }}
                  >
                    ● Du
                  </span>
                </div>
                <p>
                  Klicka på lägret eller bergspasset för att gå dit. Samla
                  resurser längs vägen.
                </p>
              </>
            )}
            {modal === "settings" && (
              <>
                <div className="modal-eyebrow">I DIN EGEN TAKT</div>
                <h2>Inställningar</h2>
                <div className="setting-row">
                  <span>Mjuka spelljud</span>
                  <button
                    className={`toggle ${sound ? "on" : ""}`}
                    onClick={() => setSound((v) => !v)}
                    aria-label="Växla ljud"
                  >
                    <i />
                  </button>
                </div>
                <div className="setting-row">
                  <span>Pausa äventyret</span>
                  <button
                    className={`toggle ${paused ? "on" : ""}`}
                    onClick={() => setPaused((v) => !v)}
                    aria-label="Växla paus"
                  >
                    <i />
                  </button>
                </div>
                <p>
                  Spelet pausar automatiskt när du öppnar en panel. Din resa
                  sparas automatiskt i den här webbläsaren.
                </p>
                <button className="secondary" onClick={() => setModal("reset")}>
                  Börja ett nytt äventyr
                </button>
              </>
            )}
            {modal === "reset" && (
              <>
                <h2>En ny början?</h2>
                <p>Ditt nuvarande äventyr börjar om från dag ett.</p>
                <button
                  className="primary"
                  onClick={() => {
                    setGame(freshGame());
                    world.current = makeWorld();
                    target.current = null;
                    setPaused(false);
                    setModal(null);
                    notify("En ny dag, ett nytt äventyr. Välkommen!");
                  }}
                >
                  Börja om
                </button>
                <button
                  className="secondary"
                  onClick={() => setModal("settings")}
                >
                  Behåll mitt äventyr
                </button>
              </>
            )}
            {modal === "help" && (
              <>
                <div className="modal-eyebrow">VÄLKOMMEN, ÄVENTYRARE</div>
                <h2>Skogen väntar på dig.</h2>
                <p>Utforska i din egen takt. Du förlorar aldrig dina saker.</p>
                <div className="help-list">
                  <p>
                    <kbd>W A S D</kbd> / piltangenter eller klick för att gå.
                  </p>
                  <p>
                    <kbd>E</kbd> / mellanslag för att samla och använda.
                  </p>
                  <p>
                    <kbd>SHIFT</kbd> för att smyga förbi nattens busar.
                  </p>
                  <p>
                    <Icon name="wood" /> Samla pinnar, sten och bär nära dig.
                  </p>
                  <p>
                    <Icon name="fire" /> Bygg eld och tält med recepten till
                    höger.
                  </p>
                  <p>
                    <Icon name="flag" /> Tillverka en slangbella, möt väktaren i
                    nordost, bygg signalmasten och signalera där!
                  </p>
                </div>
                <button className="primary" onClick={() => setModal(null)}>
                  Ut i skogen <Icon name="arrow" size={16} />
                </button>
              </>
            )}
            {modal === "win" && (
              <div className="win-content">
                <div className="plane">✈</div>
                <div className="modal-eyebrow">ALLA STIGAR LEDER HEM</div>
                <h2>Du hittade hem!</h2>
                <p>
                  Din signal lyser över skogen. Ett flygplan sveper ner över
                  träden och tar dig hela vägen till stadens varma ljus.
                </p>
                <div className="city">▂ ▆ ▃ █ ▅ ▇ ▃ ▆ ▂</div>
                <p>
                  Du samlade mod, byggde ett hem och blev vän med skogens
                  väktare. Vilket äventyr.
                </p>
                <button className="primary" onClick={() => setModal(null)}>
                  Se tillbaka på skogen
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
