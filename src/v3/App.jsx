import { useState } from "react";

// ─────────────────────────────────────────────
// CONFIG — swap these to plug your own backend
// ─────────────────────────────────────────────
const CONFIG = {
  mode: "anthropic",
  customEndpoint: "https://your-backend.com/api/analyze",
};

async function callLLM(messages, maxTokens) {
  if (CONFIG.mode === "custom") {
    const res = await fetch(CONFIG.customEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(CONFIG.customHeaders||{}) },
      body: JSON.stringify({ messages, max_tokens: maxTokens }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    return data.content?.find(b => b.type === "text")?.text || data.text || "";
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, messages }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.find(b => b.type === "text")?.text || "";
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const KEY_COLORS = {
  "C":"#e8f4f8","C#":"#d4e6f1","Db":"#d4e6f1","D":"#e8f0f8","D#":"#dce8f4","Eb":"#dce8f4",
  "E":"#e8f8f0","F":"#f8f4e8","F#":"#f4ece4","Gb":"#f4ece4","G":"#f0e8f8","G#":"#ece4f4",
  "Ab":"#ece4f4","A":"#f8e8e8","A#":"#f4e4e4","Bb":"#f4e4e4","B":"#e8f8e8"
};
const GENRE_COLORS = {
  "Pop":{bg:"#fde68a",text:"#92400e"},"Rock":{bg:"#fca5a5",text:"#7f1d1d"},
  "Rock Alt":{bg:"#f9a8d4",text:"#831843"},"Indie":{bg:"#a7f3d0",text:"#064e3b"},
  "Rap":{bg:"#c4b5fd",text:"#4c1d95"},"Hip-Hop":{bg:"#c4b5fd",text:"#4c1d95"},
  "R&B":{bg:"#fbcfe8",text:"#9d174d"},"Electronic":{bg:"#bae6fd",text:"#0c4a6e"},
  "Soul":{bg:"#fed7aa",text:"#7c2d12"},
};
const CHORD_COLORS = ["#6366f1","#a855f7","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6"];
const BEAT_LABELS = ["1","1.e","1.+","1.a","2","2.e","2.+","2.a","3","3.e","3.+","3.a","4","4.e","4.+","4.a"];
const DOWNBEATS = [0,4,8,12];
const DEFAULT_DRUMS = {
  kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  hhc:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],hho:[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
  crash:[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
};
const DRUM_ROWS = [
  {name:"Kick",icon:"🥁",key:"kick",color:"#ef4444",light:"#fee2e2"},
  {name:"Snare",icon:"🪘",key:"snare",color:"#f97316",light:"#ffedd5"},
  {name:"Hi-Hat fermé",icon:"🎩",key:"hhc",color:"#eab308",light:"#fef9c3"},
  {name:"Hi-Hat ouvert",icon:"🎵",key:"hho",color:"#22c55e",light:"#dcfce7"},
  {name:"Crash",icon:"💥",key:"crash",color:"#6366f1",light:"#eef2ff"},
];
const NOTE_PLACEMENTS = [
  {sub:0,dur:4,label:"♩"},{sub:4,dur:2,label:"♪"},{sub:6,dur:2,label:"♪"},
  {sub:8,dur:4,label:"♩"},{sub:12,dur:2,label:"♪"},{sub:14,dur:2,label:"♪"},
];

const LOCAL_SONGS = {
  "Nirvana – Smells Like Teen Spirit": {
    title:"Smells Like Teen Spirit",artist:"Nirvana",genre:"Rock",bpm:117,key:"Fm",
    keyFull:"Fa mineur (F minor)",scale:"Gamme mineure naturelle",timeSignature:"4/4",
    tempoFeel:"Grunge mid-tempo, heavy et explosif",difficulty:"⭐ Débutant",
    instruments:"Guitare électrique distorsion, basse, batterie, voix",tuning:"Standard (EADGBe)",
    numeralProgression:"i – III – VI – VII",chordNames:"Fm – Ab – Db – Eb",
    chords:[
      {name:"Fm",role:"i (tonique)",notes:"Fa – Lab – Do",tip:"Riff principal, power chord sur le 1er temps."},
      {name:"Ab",role:"III (médiante)",notes:"Lab – Do – Mib",tip:"Relatif majeur, apporte la tension."},
      {name:"Db",role:"VI (sous-dominante)",notes:"Réb – Fa – Lab",tip:"Couleur sombre caractéristique du grunge."},
      {name:"Eb",role:"VII (sous-tonique)",notes:"Mib – Sol – Sib",tip:"Résolution vers Fm, crée l'élan."},
    ],
    structure:[{name:"Intro",bars:4},{name:"Verse 1",bars:8},{name:"Pré-chorus",bars:4},{name:"Chorus",bars:8},{name:"Verse 2",bars:8},{name:"Chorus",bars:8},{name:"Bridge",bars:8},{name:"Outro",bars:4}],
    tips:["Le riff est joué en power chords : Fm5, Ab5, Db5, Eb5.","Utilise une pédale de distorsion/overdrive heavy.","Le chorus sonne plus fort grâce au passage couplet chuchoté → refrain crié.","La batterie de Dave Grohl : kick sur 1, snare sur 2 et 4, hi-hat en croches.","Accorde ta guitare en standard, joue la corde de La à vide pour Fm."],
    drumPattern:{kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hhc:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],hho:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],crash:[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
    youtubeUrl:"https://www.youtube.com/watch?v=hTWKbfoikeg",tutorialUrl:"https://www.youtube.com/results?search_query=smells+like+teen+spirit+guitar+tutorial",chordsUrl:"https://www.ultimate-guitar.com/search.php?search_type=title&value=smells+like+teen+spirit+nirvana",midiUrl:"https://bitmidi.com/search?q=smells+like+teen+spirit",midiNote:"Cherche 'Smells Like Teen Spirit' sur BitMidi.",
  },
};

const RANDOM_POOL_API = ["Nirvana – Smells Like Teen Spirit","Radiohead – Creep","Arctic Monkeys – R U Mine?","Kendrick Lamar – HUMBLE.","Frank Ocean – Pyramids","Mac Miller – Self Care","The Strokes – Last Nite","Tame Impala – The Less I Know The Better","Amy Winehouse – Back to Black","The Weeknd – Save Your Tears","Daft Punk – Get Lucky","Stromae – Alors on danse","PNL – Au DD","Oasis – Wonderwall","Billie Eilish – bad guy"];
const LOCAL_KEYS = Object.keys(LOCAL_SONGS);
const hasAPI = () => CONFIG.mode !== "none";

const DEFAULT_SONG = {
  title:"Blinding Lights",artist:"The Weeknd",genre:"Pop",bpm:171,key:"Am",
  keyFull:"La mineur (A minor)",scale:"Gamme mineure naturelle",timeSignature:"4/4",
  tempoFeel:"Synth-pop rapide, feel années 80",difficulty:"⭐⭐ Intermédiaire",
  instruments:"Synth lead, basse, batterie électronique, voix",tuning:null,
  numeralProgression:"i – VI – III – VII",chordNames:"Am – F – C – G",
  chords:[
    {name:"Am",role:"i (tonique)",notes:"La – Do – Mi",tip:"Point d'ancrage, couleur sombre."},
    {name:"F",role:"VI (sous-dominante)",notes:"Fa – La – Do",tip:"Résolution naturelle depuis Am."},
    {name:"C",role:"III (médiante)",notes:"Do – Mi – Sol",tip:"Accord majeur relatif, lumineux."},
    {name:"G",role:"VII (sous-tonique)",notes:"Sol – Si – Ré",tip:"Tension avant le retour sur Am."},
  ],
  structure:[{name:"Intro",bars:4},{name:"Verse 1",bars:8},{name:"Pré-chorus",bars:4},{name:"Chorus",bars:8},{name:"Verse 2",bars:8},{name:"Chorus",bars:8},{name:"Outro",bars:4}],
  tips:["Lance un métronome à 171 BPM avant de jouer quoi que ce soit.","La progression Am–F–C–G tourne en boucle : maîtrise-la avant d'ajouter la mélodie.","Le synth lead joue sur Am principalement sur La, Do, Mi.","La basse suit le root de chaque accord en croches régulières.","Pour le son 80s : synth avec chorus + reverb plate, delay en croche pointée."],
  youtubeUrl:"https://www.youtube.com/watch?v=4NRXx6U8ABQ",
  tutorialUrl:"https://www.youtube.com/results?search_query=blinding+lights+piano+tutorial",
  chordsUrl:"https://www.ultimate-guitar.com/search.php?search_type=title&value=blinding+lights+weeknd",
  midiUrl:"https://bitmidi.com/search?q=blinding+lights",
  midiNote:"Cherche 'Blinding Lights' sur BitMidi ou FreeMidi pour importer dans FL Studio.",
};

function buildPrompt(title) {
  return "Tu es un expert en théorie musicale et production. Analyse ce morceau : \"" + title + "\".\n" +
    "Réponds UNIQUEMENT en JSON valide, sans backticks.\n" +
    "{\"title\":\"str\",\"artist\":\"str\",\"genre\":\"Pop|Rock|Rock Alt|Indie|Rap|Hip-Hop|R&B|Electronic|Soul\"," +
    "\"bpm\":120,\"key\":\"Am\",\"keyFull\":\"str\",\"scale\":\"str\",\"timeSignature\":\"4/4\"," +
    "\"tempoFeel\":\"str\",\"difficulty\":\"str\",\"instruments\":\"str\",\"tuning\":null," +
    "\"numeralProgression\":\"str\",\"chordNames\":\"str\"," +
    "\"chords\":[{\"name\":\"Am\",\"role\":\"i\",\"notes\":\"La – Do – Mi\",\"tip\":\"str\"}]," +
    "\"structure\":[{\"name\":\"str\",\"bars\":4}]," +
    "\"tips\":[\"str\",\"str\",\"str\",\"str\",\"str\"]," +
    "\"drumPattern\":{\"kick\":[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],\"snare\":[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],\"hhc\":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],\"hho\":[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],\"crash\":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}," +
    "\"youtubeUrl\":\"https://youtube.com/watch?v=ID\",\"tutorialUrl\":\"https://youtube.com/results?search_query=TITRE+tutorial\"," +
    "\"chordsUrl\":\"https://www.ultimate-guitar.com/search.php?search_type=title&value=TITRE\"," +
    "\"midiUrl\":\"https://bitmidi.com/search?q=TITRE\",\"midiNote\":\"Conseil MIDI\"}";
}

// ─────────────────────────────────────────────
// V3 COMPONENTS - REDESIGNED
// ─────────────────────────────────────────────
function Badge({ genre }) {
  const c = GENRE_COLORS[genre] || {bg:"#e2e8f0",text:"#1e293b"};
  return <span style={{background:c.bg,color:c.text,borderRadius:20,padding:"2px 12px",fontSize:12,fontWeight:600}}>{genre}</span>;
}

function Section({ title, children, icon }) {
  return (
    <div style={{marginBottom:24}}>
      <div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#334155",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

function LinkButton({ href, label, icon, color }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:color,color:"#fff",borderRadius:10,padding:"10px 16px",fontSize:12,fontWeight:600,textDecoration:"none",marginRight:10,marginBottom:10,transition:"transform .15s,box-shadow .15s"}}>
      {icon} {label}
    </a>
  );
}

function ChordPill({ chord, isActive, onClick }) {
  return (
    <div onClick={onClick} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",background:isActive?"#6366f1":"#f1f5f9",color:isActive?"#fff":"#1e293b",borderRadius:12,padding:"10px 20px",margin:6,cursor:"pointer",boxShadow:isActive?"0 4px 12px #6366f140":"none",userSelect:"none",transition:"all .2s"}}>
      <span style={{fontSize:20,fontWeight:800}}>{chord.name}</span>
      <span style={{fontSize:9,opacity:.7,marginTop:2,fontWeight:500}}>{chord.role}</span>
    </div>
  );
}

function StructureSection({ song }) {
  const [open, setOpen] = useState(null);
  const DESCS = {"Intro":"Pose l'ambiance.","Verse":"Mélodie posée.","Verse 1":"Intro mélodique.","Verse 2":"Énergie monte.","Pré-chorus":"Tension.","Pre-Chorus":"Densifie.","Chorus":"Tout fort.","Bridge":"Rupture.","Outro":"Fade-out.","Hook":"Phrase répétée."};
  const chords = song.chords || [];
  function getMesures(bars) {
    return Array.from({length:bars},(_,i)=>({bar:i+1,chord:chords[i%chords.length]?.name||"?",role:(chords[i%chords.length]?.role||"").split(" ")[0]}));
  }
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {song.structure.map((s,i)=>{
        const isOpen = open===i;
        return (
          <div key={i} style={{borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden",background:"#fff"}}>
            <div onClick={()=>setOpen(isOpen?null:i)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",cursor:"pointer",background:isOpen?"#eef2ff":"#f8fafc",transition:"background .2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{background:isOpen?"#6366f1":"#e2e8f0",color:isOpen?"#fff":"#64748b",borderRadius:8,fontSize:11,fontWeight:800,padding:"4px 10px",minWidth:28,textAlign:"center"}}>{i+1}</span>
                <strong style={{fontSize:14,color:isOpen?"#4338ca":"#1e293b"}}>{s.name}</strong>
                <span style={{fontSize:11,color:"#94a3b8"}}>{s.bars}m</span>
              </div>
              <span style={{fontSize:14,color:"#94a3b8",transition:"transform .2s",transform:isOpen?"rotate(180deg)":"none"}}>▾</span>
            </div>
            {isOpen&&(
              <div style={{padding:"14px 16px",background:"#fff",borderTop:"1px solid #e2e8f0"}}>
                <p style={{fontSize:12,color:"#475569",lineHeight:1.6,margin:"0 0 12px"}}>{DESCS[s.name]||("Section "+s.bars+" mesures.")}</p>
                <div style={{overflowX:"auto"}}>
                  <div style={{display:"flex",gap:6,minWidth:"max-content"}}>
                    {getMesures(s.bars).map((m,j)=>(
                      <div key={j} style={{background:"#f1f5f9",borderRadius:8,padding:"6px 10px",textAlign:"center",minWidth:48,flexShrink:0}}>
                        <div style={{fontSize:9,color:"#94a3b8"}}>M{m.bar}</div>
                        <div style={{fontSize:14,fontWeight:700,color:"#4338ca"}}>{m.chord}</div>
                        <div style={{fontSize:8,color:"#94a3b8"}}>{m.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RhythmGrid({ song }) {
  const chords = song.chords || [];
  return (
    <div style={{overflowX:"auto"}}>
      <div style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>1 mesure · double-croches</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(16,1fr)",gap:2,minWidth:480,marginBottom:10}}>
        {BEAT_LABELS.map((l,i)=>{
          const isDown=DOWNBEATS.includes(i), isUp=l.includes("+");
          const ci=DOWNBEATS.indexOf(i);
          const chord=ci>=0?chords[ci%chords.length]?.name:null;
          return (
            <div key={i} style={{borderRadius:6,padding:"6px 2px",textAlign:"center",background:isDown?"#6366f1":isUp?"#e0e7ff":"#f1f5f9",color:isDown?"#fff":"#475569",fontSize:9,fontWeight:isDown?700:400,border:chord?"2px solid #a855f7":"none"}}>
              {l}<br/>{chord?<span style={{fontSize:8,color:isDown?"#c4b5fd":"#7c3aed",fontWeight:700}}>{chord}</span>:null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DrumGrid({ song }) {
  const pattern = song.drumPattern || DEFAULT_DRUMS;
  return (
    <div style={{overflowX:"auto"}}>
      <div style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>Pattern · {song.genre}</div>
      <div style={{display:"grid",gridTemplateColumns:"100px repeat(16,1fr)",gap:2,minWidth:540,marginBottom:4}}>
        <div/>{BEAT_LABELS.map((l,i)=><div key={i} style={{fontSize:8,textAlign:"center",color:DOWNBEATS.includes(i)?"#6366f1":"#94a3b8",fontWeight:DOWNBEATS.includes(i)?700:400}}>{l}</div>)}
      </div>
      {DRUM_ROWS.map(row=>(
        <div key={row.key} style={{display:"grid",gridTemplateColumns:"100px repeat(16,1fr)",gap:2,minWidth:540,marginBottom:3}}>
          <div style={{fontSize:10,color:"#334155",fontWeight:600,display:"flex",alignItems:"center",gap:4}}><span>{row.icon}</span>{row.name}</div>
          {(pattern[row.key]||DEFAULT_DRUMS[row.key]).map((on,i)=>(
            <div key={i} style={{height:24,borderRadius:4,background:on?row.color:row.light,border:"1px solid "+(on?row.color:"#e2e8f0"),display:"flex",alignItems:"center",justifyContent:"center",opacity:DOWNBEATS.includes(i)?1:on?0.8:0.3}}>
              {on?<span style={{fontSize:7,color:"#fff",fontWeight:800}}>●</span>:null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SongCard({ song }) {
  const [activeChord, setActiveChord] = useState(null);
  const keyBg = KEY_COLORS[song.key] || "#f8fafc";
  return (
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{background:"linear-gradient(135deg,#1e1b4b 0%,#2d1b69 50%,#312e81 100%)",borderRadius:"20px 20px 0 0",padding:"32px 24px",color:"#fff"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:28,fontWeight:900,lineHeight:1.1}}>{song.title}</div>
            <div style={{fontSize:16,opacity:.7,marginTop:6}}>{song.artist}</div>
          </div>
          <Badge genre={song.genre}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:20}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:32,fontWeight:900}}>{song.bpm}</div><div style={{fontSize:10,opacity:.6,marginTop:4}}>BPM</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:32,fontWeight:900,color:"#a5b4fc"}}>{song.key}</div><div style={{fontSize:10,opacity:.6,marginTop:4}}>KEY</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:32,fontWeight:900}}>{song.timeSignature}</div><div style={{fontSize:10,opacity:.6,marginTop:4}}>TIME</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#86efac"}}>{song.difficulty}</div><div style={{fontSize:10,opacity:.6,marginTop:4}}>LEVEL</div></div>
        </div>
      </div>

      <div style={{background:"#fff",borderRadius:"0 0 20px 20px",padding:28,border:"1px solid #e2e8f0",borderTop:"none"}}>
        <Section title="Progression" icon="🎼">
          <div style={{background:keyBg,borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{fontSize:12,color:"#475569",marginBottom:6}}><strong>Chiffrage :</strong> {song.numeralProgression}</div>
            <div style={{fontSize:12,color:"#475569"}}><strong>Accords :</strong> {song.chordNames}</div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap"}}>
            {song.chords.map((c,i)=>(
              <ChordPill key={i} chord={c} isActive={activeChord===i} onClick={()=>setActiveChord(activeChord===i?null:i)}/>
            ))}
          </div>
          {activeChord!==null&&(
            <div style={{background:"#eef2ff",borderRadius:12,padding:14,marginTop:12,borderLeft:"4px solid #6366f1"}}>
              <div style={{fontWeight:700,color:"#4338ca",marginBottom:4}}>{song.chords[activeChord].name}</div>
              <div style={{fontSize:12,color:"#334155"}}>{song.chords[activeChord].notes}</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{song.chords[activeChord].tip}</div>
            </div>
          )}
        </Section>

        <Section title="Structure" icon="📍"><StructureSection song={song}/></Section>
        <Section title="Rythme" icon="⏱️"><RhythmGrid song={song}/></Section>
        <Section title="Batterie" icon="🥁"><DrumGrid song={song}/></Section>

        <Section title="Infos" icon="ℹ️">
          <div style={{background:"#f8fafc",borderRadius:12,padding:14,display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
            {[["Tonalité",song.keyFull],["Gamme",song.scale],["Tempo",song.tempoFeel],["Instruments",song.instruments]].map(([l,v],i)=>(
              <div key={i}><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{l}</div><div style={{fontSize:11,color:"#1e293b",marginTop:4}}>{v}</div></div>
            ))}
          </div>
        </Section>

        <Section title="Conseils" icon="💡">
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {song.tips.map((tip,i)=>(
              <div key={i} style={{display:"flex",gap:10,background:"#f0fdf4",borderRadius:10,padding:"12px 14px",borderLeft:"3px solid #22c55e"}}>
                <span style={{fontSize:14,minWidth:20,fontWeight:700,color:"#22c55e"}}>{i+1}</span>
                <span style={{fontSize:12,color:"#166534",lineHeight:1.5}}>{tip}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Ressources" icon="🔗">
          <div style={{display:"flex",flexWrap:"wrap"}}>
            {song.youtubeUrl&&<LinkButton href={song.youtubeUrl} label="YouTube" icon="▶" color="#ff0000"/>}
            {song.tutorialUrl&&<LinkButton href={song.tutorialUrl} label="Tuto" icon="🎸" color="#6366f1"/>}
            {song.chordsUrl&&<LinkButton href={song.chordsUrl} label="Tabs" icon="🎵" color="#0f172a"/>}
            {song.midiUrl&&<LinkButton href={song.midiUrl} label="MIDI" icon="🎹" color="#0891b2"/>}
          </div>
          {song.midiNote&&(
            <div style={{background:"#f0f9ff",borderRadius:10,padding:"12px 14px",borderLeft:"3px solid #0891b2",marginTop:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#0c4a6e"}}>🎹 FL Studio</div>
              <div style={{fontSize:11,color:"#075985",lineHeight:1.5,marginTop:4}}>{song.midiNote}</div>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Landing({ onStart }) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#0f0c29,#1e1b4b,#0f0c29)",padding:32,textAlign:"center"}}>
      <div style={{marginBottom:40}}>
        <div style={{fontSize:12,fontWeight:900,letterSpacing:4,color:"#a5b4fc",textTransform:"uppercase",marginBottom:14}}>♪ Music Theory Master</div>
        <div style={{width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#6366f1,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto",boxShadow:"0 12px 40px #6366f160"}}>🎸</div>
      </div>
      <h1 style={{fontSize:40,fontWeight:900,color:"#fff",margin:"0 0 16px",lineHeight:1.1}}>Maîtrise chaque <span style={{color:"#a5b4fc"}}>morceau</span></h1>
      <p style={{fontSize:16,color:"#94a3b8",maxWidth:440,lineHeight:1.8,margin:"0 0 40px"}}>
        BPM · Tonalité · Accords · Structure · Pattern batterie · Grille mélodique · Liens MIDI
      </p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
        {["🎯 Analyse","🎲 Aléatoire","🔍 Suggestions","📐 Mesure/Mesure","🥁 Batterie","🎹 MIDI"].map((f,i)=>(
          <div key={i} style={{background:"#ffffff10",border:"1px solid #ffffff18",borderRadius:12,padding:"10px 16px",color:"#e2e8f0",fontSize:12,fontWeight:600}}>{f}</div>
        ))}
      </div>
      <button onClick={onStart} style={{background:"linear-gradient(135deg,#6366f1,#a855f7)",color:"#fff",border:"none",borderRadius:14,padding:"14px 44px",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:"0 8px 24px #6366f160",transition:"transform .2s"}}>
        Démarrer →
      </button>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [song, setSong] = useState(DEFAULT_SONG);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggLoading, setSuggLoading] = useState(false);

  if (!started) return <Landing onStart={()=>setStarted(true)}/>;

  async function fetchSongByTitle(title) {
    const localKey = LOCAL_KEYS.find(k => k.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(k.split("–")[1]?.trim().toLowerCase()||""));
    if (localKey) { setSong(LOCAL_SONGS[localKey]); setInput(""); setSuggestions([]); return; }
    if (!hasAPI()) { setError("Offline mode. Local songs only."); return; }
    setLoading(true); setError(""); setSuggestions([]);
    try {
      const text = await callLLM([{role:"user",content:buildPrompt(title)}], 1800);
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON in response");
      setSong(JSON.parse(match[0]));
      setInput("");
    } catch(e) { setError("Error: " + e.message); }
    setLoading(false);
  }

  async function fetchSuggestions(val) {
    if (!val.trim()||val.includes("–")||val.includes("-")) { setSuggestions([]); return; }
    const localMatches = LOCAL_KEYS.filter(k => k.toLowerCase().includes(val.toLowerCase())).map(k => k.split("–")[1]?.trim()||k);
    if (localMatches.length) { setSuggestions(localMatches.slice(0,5)); return; }
    if (!hasAPI()) { setSuggestions([]); return; }
    setSuggLoading(true);
    try {
      const q = "User typed \"" + val + "\". Known artist? Respond JSON: {\"artist\":\"name\",\"titles\":[\"t1\",\"t2\",\"t3\"]} or {\"artist\":null,\"titles\":[]}.";
      const text = await callLLM([{role:"user",content:q}], 200);
      const match = text.match(/\{[\s\S]*\}/);
      if (match) setSuggestions(JSON.parse(match[0]).titles||[]);
    } catch { setSuggestions([]); }
    setSuggLoading(false);
  }

  function fetchRandom() {
    const pool = hasAPI() ? RANDOM_POOL_API : LOCAL_KEYS;
    const pick = pool[Math.floor(Math.random()*pool.length)];
    setInput(pick);
    fetchSongByTitle(pick);
  }

  return (
    <div style={{padding:"16px 0",fontFamily:"var(--font-sans,sans-serif)",background:"#fafbfc"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,maxWidth:720,margin:"0 auto",padding:"0 16px"}}>
        <button onClick={()=>setStarted(false)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"1px solid #e2e8f0",borderRadius:10,padding:"8px 16px",fontSize:12,color:"#475569",cursor:"pointer",fontWeight:600}}>
          ← Home
        </button>
        {!hasAPI() && (
          <div style={{fontSize:10,color:"#94a3b8",background:"#fff",borderRadius:10,padding:"6px 12px",border:"1px solid #e2e8f0"}}>
            🔒 Offline · {LOCAL_KEYS.length} songs
          </div>
        )}
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"0 16px"}}>
        <div style={{display:"flex",gap:8,marginBottom:suggestions.length?0:24,background:"#fff",borderRadius:14,padding:12,border:"1px solid #e2e8f0",boxShadow:"0 2px 8px #0f0c2910"}}>
          <input value={input} onChange={e=>{setInput(e.target.value);fetchSuggestions(e.target.value);}} onKeyDown={e=>e.key==="Enter"&&input.trim()&&fetchSongByTitle(input)} placeholder="Artist or Title..." style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",color:"#1e293b"}}/>
          {suggLoading&&<span style={{fontSize:13,color:"#94a3b8",alignSelf:"center"}}>…</span>}
          <button onClick={fetchRandom} disabled={loading} title="Random" style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:10,padding:"8px 12px",fontSize:18,cursor:"pointer"}}>🎲</button>
          <button onClick={()=>input.trim()&&fetchSongByTitle(input)} disabled={loading||!input.trim()} style={{background:loading?"#a5b4fc":"#6366f1",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:loading?"default":"pointer",whiteSpace:"nowrap"}}>
            {loading?"…":"Analyze ▶"}
          </button>
        </div>
        {suggestions.length>0&&(
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"0 0 12px 12px",marginBottom:16,overflow:"hidden"}}>
            {suggestions.map((t,i)=>(
              <div key={i} onClick={()=>fetchSongByTitle(t)} style={{padding:"10px 16px",fontSize:12,cursor:"pointer",borderBottom:i<suggestions.length-1?"1px solid #f1f5f9":"none",display:"flex",alignItems:"center",gap:8,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#eef2ff"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                <span style={{color:"#6366f1"}}>♪</span> {t}
              </div>
            ))}
          </div>
        )}
        {error&&<div style={{color:"#dc2626",fontSize:12,marginBottom:12,padding:"10px 12px",background:"#fef2f2",borderRadius:10}}>{error}</div>}
        <SongCard song={song}/>
      </div>
    </div>
  );
}