import { useState } from "react";

const KEY_COLORS = {
  "C": "#e8f4f8", "C#": "#d4e6f1", "Db": "#d4e6f1",
  "D": "#e8f0f8", "D#": "#dce8f4", "Eb": "#dce8f4",
  "E": "#f8f8f0", "F": "#f8f4e8", "F#": "#f4ece4",
  "Gb": "#f4ece4", "G": "#f0e8f8", "G#": "#ece4f4",
  "Ab": "#ece4f4", "A": "#f8e8e8", "A#": "#f4e4e4",
  "Bb": "#f4e4e4", "B": "#e8f8e8"
};

const GENRE_COLORS = {
  "Pop": { bg: "#fde68a", text: "#92400e" },
  "Rock": { bg: "#fca5a5", text: "#7f1d1d" },
  "Rock Alt": { bg: "#f9a8d4", text: "#831843" },
  "Indie": { bg: "#a7f3d0", text: "#064e3b" },
  "Rap": { bg: "#c4b5fd", text: "#4c1d95" },
  "Hip-Hop": { bg: "#c4b5fd", text: "#4c1d95" },
  "R&B": { bg: "#fbcfe8", text: "#9d174d" },
  "Electronic": { bg: "#bae6fd", text: "#0c4a6e" },
  "Soul": { bg: "#fed7aa", text: "#7c2d12" },
};

function Badge({ genre }) {
  const c = GENRE_COLORS[genre] || { bg: "#e2e8f0", text: "#1e293b" };
  return (
    <span style={{
      background: c.bg, color: c.text,
      borderRadius: 20, padding: "2px 12px",
      fontSize: 12, fontWeight: 600, letterSpacing: 0.3
    }}>{genre}</span>
  );
}

function ChordPill({ chord, isActive }) {
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      background: isActive ? "#6366f1" : "#f1f5f9",
      color: isActive ? "#fff" : "#1e293b",
      borderRadius: 10, padding: "8px 18px", margin: "4px",
      minWidth: 52, boxShadow: isActive ? "0 2px 8px #6366f140" : "none",
      transition: "all .2s", cursor: "default", userSelect: "none"
    }}>
      <span style={{ fontSize: 18, fontWeight: 700 }}>{chord.name}</span>
      <span style={{ fontSize: 10, opacity: .7, marginTop: 2 }}>{chord.role}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
        color: "#64748b", textTransform: "uppercase", marginBottom: 8
      }}>{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "baseline" }}>
      <span style={{ fontSize: 13, color: "#64748b", minWidth: 120 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", fontFamily: mono ? "monospace" : "inherit" }}>{value}</span>
    </div>
  );
}

function LinkButton({ href, label, icon, color }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: color, color: "#fff", borderRadius: 8,
      padding: "8px 16px", fontSize: 13, fontWeight: 600,
      textDecoration: "none", marginRight: 8, marginBottom: 8,
      transition: "opacity .15s"
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {icon} {label}
    </a>
  );
}

function StructureSection({ song }) {
  const [open, setOpen] = useState(null);

  const details = {
    "Intro": `Pose l'ambiance. Joue ${song.chords?.[0]?.name || "l'accord i"} en boucle sur ${song.structure?.find(s => s.name === "Intro")?.bars || 4} mesures. Écoute bien le groove et les textures avant d'entrer dans le vif.`,
    "Verse": `Progression complète ${song.chordNames} sur chaque groupe de 4 mesures. La mélodie vocale reste basse, pose le texte. Garde le jeu léger et spacieux.`,
    "Verse 1": `Progression complète ${song.chordNames}. Mélodie vocale introductive, jeu léger. Repère le motif rythmique principal.`,
    "Verse 2": `Même progression que le Verse 1 mais l'énergie monte légèrement. Ajoute des nuances dynamiques si tu joues un instrument.`,
    "Pré-chorus": `Tension qui monte vers le refrain. Souvent sur les 2 derniers accords de la progression (${song.chords?.slice(-2).map(c => c.name).join(" – ") || "VI – VII"}). Joue plus fort, plus tendu.`,
    "Pre-Chorus": `Tension qui monte vers le refrain. Joue plus fort, densifie le son.`,
    "Chorus": `Tout le monde joue fort. Progression complète ${song.chordNames} avec la mélodie principale. C'est le moment le plus mémorable — soigne les transitions entre accords.`,
    "Bridge": `Rupture harmonique ou rythmique. Souvent une nouvelle progression ou un accord inhabituel. Crée le contraste maximal avant le dernier refrain.`,
    "Outro": `Descend progressivement en énergie. Souvent juste l'accord final ${song.chords?.[0]?.name || "i"} répété ou une fade-out sur la boucle principale.`,
    "Hook": `Phrase mélodique répétée et accrocheuse. Mémorise-la en priorité — c'est ce que tout le monde retient.`,
    "Drop": `Moment de relâchement avant une montée d'énergie. Souvent batterie seule ou silence partiel.`,
  };

  function getDetail(name, bars) {
    const base = details[name] || `Section de ${bars} mesures. Joue la progression ${song.chordNames} et écoute bien la dynamique spécifique à cette partie.`;
    return base;
  }

  function getMesures(name, bars) {
    const prog = song.chords || [];
    if (!prog.length) return null;
    const rows = [];
    for (let i = 0; i < bars; i++) {
      const chord = prog[i % prog.length];
      rows.push({ bar: i + 1, chord: chord?.name || "?", role: chord?.role || "" });
    }
    return rows;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {song.structure.map((s, i) => {
        const isOpen = open === i;
        const mesures = getMesures(s.name, s.bars);
        return (
          <div key={i} style={{ borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", cursor: "pointer",
                background: isOpen ? "#eef2ff" : "#f8fafc",
                transition: "background .15s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  background: isOpen ? "#6366f1" : "#e2e8f0",
                  color: isOpen ? "#fff" : "#64748b",
                  borderRadius: 6, fontSize: 11, fontWeight: 700,
                  padding: "2px 8px", minWidth: 20, textAlign: "center"
                }}>{i + 1}</span>
                <strong style={{ fontSize: 14, color: isOpen ? "#4338ca" : "#1e293b" }}>{s.name}</strong>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.bars} mesures</span>
              </div>
              <span style={{ fontSize: 12, color: "#94a3b8", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
            </div>
            {isOpen && (
              <div style={{ padding: "12px 14px", background: "#fff", borderTop: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: "0 0 12px" }}>{getDetail(s.name, s.bars)}</p>
                {mesures && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {mesures.map((m, j) => (
                      <div key={j} style={{
                        background: "#f1f5f9", borderRadius: 8,
                        padding: "6px 12px", textAlign: "center", minWidth: 52
                      }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>M{m.bar}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#4338ca" }}>{m.chord}</div>
                        <div style={{ fontSize: 9, color: "#94a3b8" }}>{m.role.split(" ")[0]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SongCard({ song }) {
  const [activeChord, setActiveChord] = useState(null);
  const keyBg = KEY_COLORS[song.key] || "#f8fafc";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        borderRadius: "16px 16px 0 0", padding: "28px 28px 20px",
        color: "#fff"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>{song.title}</div>
            <div style={{ fontSize: 16, opacity: .75, marginTop: 4 }}>{song.artist}</div>
          </div>
          <Badge genre={song.genre} />
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{song.bpm}</div>
            <div style={{ fontSize: 11, opacity: .6, marginTop: 2 }}>BPM</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "#a5b4fc" }}>{song.key}</div>
            <div style={{ fontSize: 11, opacity: .6, marginTop: 2 }}>KEY</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{song.timeSignature}</div>
            <div style={{ fontSize: 11, opacity: .6, marginTop: 2 }}>TIME</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: "#86efac" }}>{song.difficulty}</div>
            <div style={{ fontSize: 11, opacity: .6, marginTop: 2 }}>LEVEL</div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "0 0 16px 16px", padding: 24, border: "1px solid #e2e8f0", borderTop: "none" }}>
        <Section title="Progression d'accords">
          <div style={{ background: keyBg, borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 6 }}>
              <strong>Chiffrage :</strong> {song.numeralProgression}
            </div>
            <div style={{ fontSize: 13, color: "#475569" }}>
              <strong>Accords :</strong> {song.chordNames}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {song.chords.map((c, i) => (
              <div key={i} onClick={() => setActiveChord(activeChord === i ? null : i)}>
                <ChordPill chord={c} isActive={activeChord === i} />
              </div>
            ))}
          </div>
          {activeChord !== null && (
            <div style={{
              background: "#eef2ff", borderRadius: 10, padding: 14, marginTop: 10,
              borderLeft: "3px solid #6366f1"
            }}>
              <div style={{ fontWeight: 700, color: "#4338ca", marginBottom: 4 }}>
                {song.chords[activeChord].name} — {song.chords[activeChord].role}
              </div>
              <div style={{ fontSize: 13, color: "#334155" }}>{song.chords[activeChord].notes}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{song.chords[activeChord].tip}</div>
            </div>
          )}
        </Section>

        <Section title="Structure du morceau">
          <StructureSection song={song} />
        </Section>

        <Section title="Détails techniques">
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14 }}>
            <InfoRow label="Tonalité complète" value={song.keyFull} />
            <InfoRow label="Mode / gamme" value={song.scale} />
            <InfoRow label="Tempo feel" value={song.tempoFeel} />
            <InfoRow label="Instruments clés" value={song.instruments} />
            {song.tuning && <InfoRow label="Accordage" value={song.tuning} />}
          </div>
        </Section>

        <Section title="Comment la reproduire">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {song.tips.map((tip, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, background: "#f0fdf4",
                borderRadius: 8, padding: "10px 14px",
                borderLeft: "3px solid #22c55e"
              }}>
                <span style={{ fontSize: 15, minWidth: 20 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Liens utiles">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {song.youtubeUrl && (
              <LinkButton href={song.youtubeUrl} label="Écouter sur YouTube" icon="▶" color="#ff0000" />
            )}
            {song.tutorialUrl && (
              <LinkButton href={song.tutorialUrl} label="Tuto reproduction" icon="🎸" color="#6366f1" />
            )}
            {song.chordsUrl && (
              <LinkButton href={song.chordsUrl} label="Partition / Accords" icon="🎵" color="#0f172a" />
            )}
          </div>
        </Section>

      </div>
    </div>
  );
}

export default function App() {
  const [song, setSong] = useState({
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: "Pop",
    bpm: 171,
    key: "Am",
    keyFull: "La mineur (A minor)",
    scale: "Gamme mineure naturelle",
    timeSignature: "4/4",
    tempoFeel: "Synth-pop rapide, feel années 80",
    difficulty: "⭐⭐ Intermédiaire",
    instruments: "Synth lead, basse, batterie électronique, voix",
    tuning: "Standard (EADGBe)",
    numeralProgression: "i – VI – III – VII",
    chordNames: "Am – F – C – G",
    chords: [
      { name: "Am", role: "i (tonique)", notes: "La – Do – Mi", tip: "Point d'ancrage, couleur sombre et tendue." },
      { name: "F", role: "VI (sous-dominante)", notes: "Fa – La – Do", tip: "Résolution naturelle depuis Am, couleur chaleureuse." },
      { name: "C", role: "III (médiante)", notes: "Do – Mi – Sol", tip: "Accord majeur relatif, apporte luminosité." },
      { name: "G", role: "VII (sous-tonique)", notes: "Sol – Si – Ré", tip: "Crée la tension avant le retour sur Am." },
    ],
    structure: [
      { name: "Intro", bars: 4 },
      { name: "Verse 1", bars: 8 },
      { name: "Pré-chorus", bars: 4 },
      { name: "Chorus", bars: 8 },
      { name: "Verse 2", bars: 8 },
      { name: "Pré-chorus", bars: 4 },
      { name: "Chorus", bars: 8 },
      { name: "Bridge", bars: 8 },
      { name: "Outro", bars: 4 },
    ],
    tips: [
      "Lance un métronome à 171 BPM et habitue-toi au tempo avant de jouer quoi que ce soit.",
      "La progression Am – F – C – G tourne en boucle tout le morceau : maîtrise-la parfaitement avant d'ajouter la mélodie.",
      "Le synth lead principal joue une ligne répétitive sur le Am, principalement sur les notes La, Do, Mi.",
      "La basse suit le root de chaque accord (La, Fa, Do, Sol) en croches régulières.",
      "Pour le son 80s : utilise un synth avec du chorus + reverb plate, et un arpégiateur ou delay en croche pointée.",
      "Le kick est sur 1 et 3, la caisse claire sur 2 et 4 — pattern 4/4 basique mais grosse compression.",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
    tutorialUrl: "https://www.youtube.com/results?search_query=blinding+lights+piano+tutorial",
    chordsUrl: "https://www.ultimate-guitar.com/search.php?search_type=title&value=blinding+lights+weeknd",
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSong() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    const prompt = `Tu es un expert en théorie musicale et production. L'utilisateur veut apprendre à reproduire ce morceau : "${input}".

Réponds UNIQUEMENT en JSON valide, sans backticks ni markdown, avec cette structure exacte :
{
  "title": "titre exact",
  "artist": "artiste",
  "genre": "un parmi: Pop / Rock / Rock Alt / Indie / Rap / Hip-Hop / R&B / Electronic / Soul",
  "bpm": 120,
  "key": "Am",
  "keyFull": "La mineur (A minor)",
  "scale": "Gamme mineure naturelle",
  "timeSignature": "4/4",
  "tempoFeel": "description courte du feel",
  "difficulty": "⭐ Débutant / ⭐⭐ Intermédiaire / ⭐⭐⭐ Avancé",
  "instruments": "instruments principaux",
  "tuning": "accordage si guitare, sinon null",
  "numeralProgression": "ex: I – V – vi – IV",
  "chordNames": "ex: C – G – Am – F",
  "chords": [
    { "name": "Am", "role": "i (tonique)", "notes": "La – Do – Mi", "tip": "explication courte de la fonction harmonique" }
  ],
  "structure": [
    { "name": "Intro", "bars": 4 }
  ],
  "tips": ["conseil 1", "conseil 2", "conseil 3", "conseil 4", "conseil 5"],
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID_REEL",
  "tutorialUrl": "https://www.youtube.com/results?search_query=TITRE+ARTISTE+tutorial",
  "chordsUrl": "https://www.ultimate-guitar.com/search.php?search_type=title&value=TITRE+ARTISTE"
}
Donne le vrai video ID YouTube si tu le connais. Sois précis sur la théorie musicale.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setSong(parsed);
      setInput("");
    } catch (e) {
      setError("Erreur lors de la génération. Réessaie avec le titre et l'artiste.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "16px 0", fontFamily: "var(--font-sans, sans-serif)" }}>
      <div style={{
        display: "flex", gap: 8, marginBottom: 24,
        background: "#f8fafc", borderRadius: 12,
        padding: 12, border: "1px solid #e2e8f0"
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchSong()}
          placeholder='Ex: "Smells Like Teen Spirit" ou "Kendrick Lamar – HUMBLE."'
          style={{
            flex: 1, border: "none", background: "transparent",
            fontSize: 14, outline: "none", color: "#1e293b"
          }}
        />
        <button
          onClick={fetchSong}
          disabled={loading || !input.trim()}
          style={{
            background: loading ? "#a5b4fc" : "#6366f1",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 20px", fontSize: 14, fontWeight: 600,
            cursor: loading ? "default" : "pointer", whiteSpace: "nowrap"
          }}
        >
          {loading ? "Analyse…" : "Analyser ▶"}
        </button>
      </div>
      {error && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{error}</div>}
      {song && <SongCard song={song} />}
    </div>
  );
}
