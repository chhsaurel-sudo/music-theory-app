import { useState } from "react";

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
const RANDOM_POOL = [
  "Nirvana – Smells Like Teen Spirit","Radiohead – Creep","Arctic Monkeys – R U Mine?",
  "Kendrick Lamar – HUMBLE.","Frank Ocean – Pyramids","Mac Miller – Self Care",
  "The Strokes – Last Nite","Tame Impala – The Less I Know The Better",
  "Amy Winehouse – Back to Black","The Weeknd – Save Your Tears",
  "Daft Punk – Get Lucky","Stromae – Alors on danse","PNL – Au DD",
  "Oasis – Wonderwall","Billie Eilish – bad guy","Tyler the Creator – See You Again"
];
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
  structure:[
    {name:"Intro",bars:4},{name:"Verse 1",bars:8},{name:"Pré-chorus",bars:4},
    {name:"Chorus",bars:8},{name:"Verse 2",bars:8},{name:"Pré-chorus",bars:4},
    {name:"Chorus",bars:8},{name:"Bridge",bars:8},{name:"Outro",bars:4},
  ],
  tips:[
    "Lance un métronome à 171 BPM avant de jouer quoi que ce soit.",
    "La progression Am–F–C–G tourne en boucle : maîtrise-la avant d'ajouter la mélodie.",
    "Le synth lead joue sur Am principalement sur La, Do, Mi.",
    "La basse suit le root de chaque accord en croches régulières.",
    "Pour le son 80s : synth avec chorus + reverb plate, delay en croche pointée.",
  ],
  youtubeUrl:"https://www.youtube.com/watch?v=4NRXx6U8ABQ",
  tutorialUrl:"https://www.youtube.com/results?search_query=blinding+lights+piano+tutorial",
  chordsUrl:"https://www.ultimate-guitar.com/search.php?search_type=title&value=blinding+lights+weeknd",
};

const BEAT_LABELS = ["1","1.e","1.+","1.a","2","2.e","2.+","2.a","3","3.e","3.+","3.a","4","4.e","4.+","4.a"];
const DOWNBEATS = [0,4,8,12];
const DEFAULT_DRUMS = {
  kick:  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  hhc:   [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  hho:   [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
  crash: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
};
const DRUM_ROWS = [
  {name:"Kick",icon:"🥁",key:"kick",color:"#ef4444",light:"#fee2e2"},
  {name:"Snare",icon:"🪘",key:"snare",color:"#f97316",light:"#ffedd5"},
  {name:"Hi-Hat fermé",icon:"🎩",key:"hhc",color:"#eab308",light:"#fef9c3"},
  {name:"Hi-Hat ouvert",icon:"🎵",key:"hho",color:"#22c55e",light:"#dcfce7"},
  {name:"Crash",icon:"💥",key:"crash",color:"#6366f1",light:"#eef2ff"},
];
const CHORD_COLORS = ["#6366f1","#a855f7","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6"];
const NOTE_PLACEMENTS = [
  {sub:0,dur:4,label:"♩"},{sub:4,dur:2,label:"♪"},{sub:6,dur:2,label:"♪"},
  {sub:8,dur:4,label:"♩"},{sub:12,dur:2,label:"♪"},{sub:14,dur:2,label:"♪"},
];

function Badge({ genre }) {
  const c = GENRE_COLORS[genre] || {bg:"#e2e8f0",text:"#1e293b"};
  return <span style={{background:c.bg,color:c.text,borderRadius:20,padding:"2px 12px",fontSize:12,fontWeight:600}}>{genre}</span>;
}
function Section({ title, children }) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:1.2,color:"#64748b",textTransform:"uppercase",marginBottom:8}}>{title}</div>
      {children}
    </div>
  );
}
function LinkButton({ href, label, icon, color }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display:"inline-flex",alignItems:"center",gap:6,background:color,color:"#fff",
      borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:600,
      textDecoration:"none",marginRight:8,marginBottom:8
    }}>{icon} {label}</a>
  );
}
function ChordPill({ chord, isActive, onClick }) {
  return (
    <div onClick={onClick} style={{
      display:"inline-flex",flexDirection:"column",alignItems:"center",
      background:isActive?"#6366f1":"#f1f5f9",color:isActive?"#fff":"#1e293b",
      borderRadius:10,padding:"8px 18px",margin:4,minWidth:52,cursor:"pointer",
      boxShadow:isActive?"0 2px 8px #6366f140":"none",userSelect:"none"
    }}>
      <span style={{fontSize:18,fontWeight:700}}>{chord.name}</span>
      <span style={{fontSize:10,opacity:.7,marginTop:2}}>{chord.role}</span>
    </div>
  );
}

function StructureSection({ song }) {
  const [open, setOpen] = useState(null);
  const DESCS = {
    "Intro":"Pose l'ambiance. Écoute les textures avant d'entrer dans le vif.",
    "Verse":"Progression complète. Mélodie vocale posée, jeu léger et spacieux.",
    "Verse 1":"Progression complète. Mélodie introductive, repère le motif rythmique.",
    "Verse 2":"Même progression que le Verse 1, énergie légèrement montante.",
    "Pré-chorus":"Tension vers le refrain. Joue plus fort sur les 2 derniers accords.",
    "Pre-Chorus":"Tension vers le refrain. Densifie le son.",
    "Chorus":"Tout joue fort. Mélodie principale. Soigne les transitions entre accords.",
    "Bridge":"Rupture harmonique. Contraste maximal avant le dernier refrain.",
    "Outro":"Descend en énergie. Fade-out sur l'accord principal.",
    "Hook":"Phrase mélodique répétée. Mémorise-la en priorité.",
  };
  const chords = song.chords || [];
  function getMesures(bars) {
    return Array.from({length:bars},(_,i)=>({
      bar:i+1,
      chord:chords[i%chords.length]?.name||"?",
      role:(chords[i%chords.length]?.role||"").split(" ")[0]
    }));
  }
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {song.structure.map((s,i) => {
        const isOpen = open===i;
        return (
          <div key={i} style={{borderRadius:10,border:"1px solid #e2e8f0",overflow:"hidden"}}>
            <div onClick={()=>setOpen(isOpen?null:i)} style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"10px 14px",cursor:"pointer",background:isOpen?"#eef2ff":"#f8fafc"
            }}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{background:isOpen?"#6366f1":"#e2e8f0",color:isOpen?"#fff":"#64748b",borderRadius:6,fontSize:11,fontWeight:700,padding:"2px 8px"}}>{i+1}</span>
                <strong style={{fontSize:14,color:isOpen?"#4338ca":"#1e293b"}}>{s.name}</strong>
                <span style={{fontSize:12,color:"#94a3b8"}}>{s.bars} mesures</span>
              </div>
              <span style={{fontSize:12,color:"#94a3b8",display:"inline-block",transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
            </div>
            {isOpen && (
              <div style={{padding:"12px 14px",background:"#fff",borderTop:"1px solid #e2e8f0"}}>
                <p style={{fontSize:13,color:"#334155",lineHeight:1.6,margin:"0 0 12px"}}>
                  {DESCS[s.name] || ("Section de " + s.bars + " mesures. Joue " + song.chordNames + ".")}
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {getMesures(s.bars).map((m,j)=>(
                    <div key={j} style={{background:"#f1f5f9",borderRadius:8,padding:"6px 12px",textAlign:"center",minWidth:52}}>
                      <div style={{fontSize:10,color:"#94a3b8",marginBottom:2}}>M{m.bar}</div>
                      <div style={{fontSize:16,fontWeight:700,color:"#4338ca"}}>{m.chord}</div>
                      <div style={{fontSize:9,color:"#94a3b8"}}>{m.role}</div>
                    </div>
                  ))}
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
      <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>1 mesure · subdivision en double-croches</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(16,1fr)",gap:3,minWidth:480,marginBottom:8}}>
        {BEAT_LABELS.map((l,i)=>{
          const isDown = DOWNBEATS.includes(i);
          const isUp = l.includes("+");
          const chordIdx = DOWNBEATS.indexOf(i);
          const chord = chordIdx>=0 ? chords[chordIdx%chords.length]?.name : null;
          return (
            <div key={i} style={{borderRadius:6,padding:"6px 2px",textAlign:"center",background:isDown?"#6366f1":isUp?"#e0e7ff":"#f1f5f9",color:isDown?"#fff":"#475569",border:chord?"2px solid #a855f7":"1px solid transparent"}}>
              <div style={{fontSize:10,fontWeight:isDown?700:400}}>{l}</div>
              {chord && <div style={{fontSize:9,color:isDown?"#c4b5fd":"#7c3aed",fontWeight:700,marginTop:2}}>{chord}</div>}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {[{c:"#6366f1",t:"Temps fort"},{c:"#e0e7ff",t:"Contretemps"},{c:"#f1f5f9",t:"Subdivision"}].map((l,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748b"}}>
            <div style={{width:12,height:12,borderRadius:3,background:l.c}}/>{l.t}
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748b"}}>
          <div style={{width:12,height:12,borderRadius:3,background:"#f1f5f9",border:"2px solid #a855f7"}}/>Changement d'accord
        </div>
      </div>
    </div>
  );
}

function DrumGrid({ song }) {
  const pattern = song.drumPattern || DEFAULT_DRUMS;
  return (
    <div style={{overflowX:"auto"}}>
      <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>Pattern type · 1 mesure · genre {song.genre}</div>
      <div style={{display:"grid",gridTemplateColumns:"110px repeat(16,1fr)",gap:3,minWidth:560,marginBottom:4}}>
        <div/>
        {BEAT_LABELS.map((l,i)=>(
          <div key={i} style={{fontSize:9,textAlign:"center",color:DOWNBEATS.includes(i)?"#6366f1":"#94a3b8",fontWeight:DOWNBEATS.includes(i)?700:400}}>{l}</div>
        ))}
      </div>
      {DRUM_ROWS.map(row=>(
        <div key={row.key} style={{display:"grid",gridTemplateColumns:"110px repeat(16,1fr)",gap:3,minWidth:560,marginBottom:3}}>
          <div style={{fontSize:11,color:"#334155",fontWeight:500,display:"flex",alignItems:"center",gap:4}}>
            <span>{row.icon}</span><span>{row.name}</span>
          </div>
          {(pattern[row.key]||DEFAULT_DRUMS[row.key]).map((on,i)=>(
            <div key={i} style={{height:26,borderRadius:4,background:on?row.color:row.light,border:"1px solid "+(on?row.color:"#e2e8f0"),display:"flex",alignItems:"center",justifyContent:"center",opacity:DOWNBEATS.includes(i)?1:on?0.9:0.4}}>
              {on ? <span style={{fontSize:8,color:"#fff",fontWeight:700}}>●</span> : null}
            </div>
          ))}
        </div>
      ))}
      <div style={{fontSize:11,color:"#94a3b8",marginTop:6}}>Pattern indicatif · Le morceau peut varier</div>
    </div>
  );
}

function MelodyGrid({ song }) {
  const chords = song.chords || [];
  const numBars = chords.length <= 2 ? 4 : 8;
  const totalCells = numBars * 16;
  const colTemplate = "80px repeat(" + totalCells + ",1fr)";
  const minW = totalCells * 22 + 90;

  const cells = [];
  for (let bar = 0; bar < numBars; bar++) {
    const chordIdx = bar % chords.length;
    const chord = chords[chordIdx];
    const color = CHORD_COLORS[chordIdx % CHORD_COLORS.length];
    const chordNotes = (chord?.notes || "").split("–").map(n => n.trim()).filter(Boolean);
    const noteMap = new Array(16).fill(null);
    NOTE_PLACEMENTS.forEach((nd, ni) => {
      const note = chordNotes[ni % chordNotes.length] || "?";
      noteMap[nd.sub] = {note, dur:nd.dur, label:nd.label, isStart:true, color};
      for (let d = 1; d < nd.dur; d++) {
        if (nd.sub + d < 16) noteMap[nd.sub + d] = {note, dur:nd.dur, label:"", isStart:false, color};
      }
    });
    for (let sub = 0; sub < 16; sub++) {
      cells.push({bar, sub, chordName:chord?.name||"?", chordIdx, color, ...(noteMap[sub]||{note:null,isStart:false,isEmpty:true})});
    }
  }

  return (
    <div style={{overflowX:"auto"}}>
      <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>
        {numBars} mesures · notes par accord · durées alignées sur le pattern rythmique
      </div>

      <div style={{display:"grid",gridTemplateColumns:colTemplate,gap:2,minWidth:minW,marginBottom:2}}>
        <div/>
        {cells.map((c,i)=>(
          <div key={i} style={{fontSize:8,textAlign:"center",color:c.sub===0?"#6366f1":DOWNBEATS.includes(c.sub)?"#94a3b8":"#e2e8f0",fontWeight:c.sub===0?700:400,borderLeft:c.sub===0?"2px solid #6366f130":"none"}}>
            {c.sub===0 ? "M"+(c.bar+1) : DOWNBEATS.includes(c.sub) ? (c.sub/4+1) : ""}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:colTemplate,gap:2,minWidth:minW,marginBottom:2}}>
        <div style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center"}}>Accord</div>
        {cells.map((c,i)=>(
          <div key={i} style={{height:20,borderRadius:3,fontSize:9,fontWeight:700,background:c.sub===0?c.color:"transparent",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",borderLeft:c.sub!==0&&DOWNBEATS.includes(c.sub)?"1px dashed #e2e8f0":"none"}}>
            {c.sub===0 ? c.chordName : ""}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:colTemplate,gap:2,minWidth:minW,marginBottom:2}}>
        <div style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center"}}>Mélodie</div>
        {cells.map((c,i)=>(
          <div key={i} style={{height:32,borderRadius:4,fontSize:9,fontWeight:700,background:c.note?(c.isStart?c.color:c.color+"55"):"#f8fafc",color:c.note?"#fff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:1,border:c.note?"none":"1px solid #f1f5f9",borderLeft:c.sub===0?"2px solid #6366f120":"none"}}>
            {c.isStart&&c.note ? (<><span style={{fontSize:10}}>{c.note}</span><span style={{fontSize:8,opacity:.8}}>{c.label}</span></>) : null}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:colTemplate,gap:2,minWidth:minW,marginBottom:8}}>
        <div style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center"}}>Durée</div>
        {cells.map((c,i)=>(
          <div key={i} style={{height:16,fontSize:8,textAlign:"center",color:"#94a3b8",borderBottom:c.note?"2px solid "+c.color:"1px solid #f1f5f9"}}>
            {c.isStart&&c.note ? c.label : ""}
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:4}}>
        {chords.slice(0,4).map((ch,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748b"}}>
            <div style={{width:12,height:12,borderRadius:3,background:CHORD_COLORS[i%CHORD_COLORS.length]}}/>
            {ch.name} — {ch.notes}
          </div>
        ))}
        <div style={{fontSize:11,color:"#94a3b8",marginLeft:8}}>♩ noire · ♪ croche</div>
      </div>
    </div>
  );
}

function SongCard({ song }) {
  const [activeChord, setActiveChord] = useState(null);
  const keyBg = KEY_COLORS[song.key] || "#f8fafc";
  return (
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{background:"linear-gradient(135deg,#1e1b4b,#312e81)",borderRadius:"16px 16px 0 0",padding:"28px 28px 20px",color:"#fff"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:22,fontWeight:700,lineHeight:1.2}}>{song.title}</div>
            <div style={{fontSize:16,opacity:.75,marginTop:4}}>{song.artist}</div>
          </div>
          <Badge genre={song.genre}/>
        </div>
        <div style={{display:"flex",gap:20,marginTop:16,flexWrap:"wrap"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:800}}>{song.bpm}</div><div style={{fontSize:11,opacity:.6}}>BPM</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:800,color:"#a5b4fc"}}>{song.key}</div><div style={{fontSize:11,opacity:.6}}>KEY</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:800}}>{song.timeSignature}</div><div style={{fontSize:11,opacity:.6}}>TIME</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#86efac"}}>{song.difficulty}</div><div style={{fontSize:11,opacity:.6}}>LEVEL</div></div>
        </div>
      </div>

      <div style={{background:"#fff",borderRadius:"0 0 16px 16px",padding:24,border:"1px solid #e2e8f0",borderTop:"none"}}>
        <Section title="Progression d'accords">
          <div style={{background:keyBg,borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{fontSize:13,color:"#475569",marginBottom:6}}><strong>Chiffrage :</strong> {song.numeralProgression}</div>
            <div style={{fontSize:13,color:"#475569"}}><strong>Accords :</strong> {song.chordNames}</div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap"}}>
            {song.chords.map((c,i)=>(
              <ChordPill key={i} chord={c} isActive={activeChord===i} onClick={()=>setActiveChord(activeChord===i?null:i)}/>
            ))}
          </div>
          {activeChord!==null && (
            <div style={{background:"#eef2ff",borderRadius:10,padding:14,marginTop:10,borderLeft:"3px solid #6366f1"}}>
              <div style={{fontWeight:700,color:"#4338ca",marginBottom:4}}>{song.chords[activeChord].name} — {song.chords[activeChord].role}</div>
              <div style={{fontSize:13,color:"#334155"}}>{song.chords[activeChord].notes}</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:4}}>{song.chords[activeChord].tip}</div>
            </div>
          )}
        </Section>

        <Section title="Structure du morceau"><StructureSection song={song}/></Section>
        <Section title="Grille rythmique"><RhythmGrid song={song}/></Section>
        <Section title="Pattern de batterie"><DrumGrid song={song}/></Section>
        <Section title="Pattern mélodique"><MelodyGrid song={song}/></Section>

        <Section title="Détails techniques">
          <div style={{background:"#f8fafc",borderRadius:10,padding:14}}>
            {[["Tonalité complète",song.keyFull],["Mode / gamme",song.scale],["Tempo feel",song.tempoFeel],["Instruments clés",song.instruments],song.tuning&&["Accordage",song.tuning]].filter(Boolean).map(([label,value],i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"baseline"}}>
                <span style={{fontSize:13,color:"#64748b",minWidth:130}}>{label}</span>
                <span style={{fontSize:14,fontWeight:600,color:"#1e293b"}}>{value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Comment la reproduire">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {song.tips.map((tip,i)=>(
              <div key={i} style={{display:"flex",gap:10,background:"#f0fdf4",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid #22c55e"}}>
                <span style={{fontSize:15,minWidth:20}}>{i+1}.</span>
                <span style={{fontSize:13,color:"#166534",lineHeight:1.5}}>{tip}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Liens utiles">
          <div style={{display:"flex",flexWrap:"wrap"}}>
            {song.youtubeUrl && <LinkButton href={song.youtubeUrl} label="YouTube" icon="▶" color="#ff0000"/>}
            {song.tutorialUrl && <LinkButton href={song.tutorialUrl} label="Tuto reproduction" icon="🎸" color="#6366f1"/>}
            {song.chordsUrl && <LinkButton href={song.chordsUrl} label="Accords / Tabs" icon="🎵" color="#0f172a"/>}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Landing({ onStart }) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#0f0c29,#1e1b4b,#0f0c29)",padding:32,textAlign:"center"}}>
      <div style={{marginBottom:32}}>
        <div style={{fontSize:13,fontWeight:800,letterSpacing:3,color:"#a5b4fc",textTransform:"uppercase",marginBottom:10}}>♪ Fake it Until U make It</div>
        <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#6366f1,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto",boxShadow:"0 8px 32px #6366f160"}}>🎸</div>
      </div>
      <h1 style={{fontSize:36,fontWeight:900,color:"#fff",margin:"0 0 12px",lineHeight:1.15}}>Apprends en <span style={{color:"#a5b4fc"}}>copiant</span></h1>
      <p style={{fontSize:16,color:"#94a3b8",maxWidth:400,lineHeight:1.7,margin:"0 0 40px"}}>
        Choisis n'importe quel morceau et obtiens son <strong style={{color:"#c4b5fd"}}>BPM</strong>, sa <strong style={{color:"#c4b5fd"}}>tonalité</strong>, sa <strong style={{color:"#c4b5fd"}}>progression d'accords</strong>, sa structure et son pattern de batterie.
      </p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:44}}>
        {["🎯 Un morceau à la fois","🎲 Morceau aléatoire","🔍 Suggestions artiste","📐 Structure mesure/mesure","🥁 Grille batterie","🎵 Pattern mélodique"].map((f,i)=>(
          <div key={i} style={{background:"#ffffff10",border:"1px solid #ffffff18",borderRadius:10,padding:"10px 16px",color:"#e2e8f0",fontSize:13}}>{f}</div>
        ))}
      </div>
      <button onClick={onStart} style={{background:"linear-gradient(135deg,#6366f1,#a855f7)",color:"#fff",border:"none",borderRadius:14,padding:"16px 40px",fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 8px 24px #6366f150"}}>
        Commencer à apprendre →
      </button>
    </div>
  );
}

async function callAPI(messages, maxTokens) {
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,messages})
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.find(b=>b.type==="text")?.text||"";
}

const PROMPT = function(title) {
  return "Tu es un expert en théorie musicale. L'utilisateur veut apprendre à reproduire : \"" + title + "\".\n" +
    "Réponds UNIQUEMENT en JSON valide, sans backticks.\n" +
    "Structure : {\"title\":\"str\",\"artist\":\"str\",\"genre\":\"Pop|Rock|Rock Alt|Indie|Rap|Hip-Hop|R&B|Electronic|Soul\",\"bpm\":120,\"key\":\"Am\",\"keyFull\":\"str\",\"scale\":\"str\",\"timeSignature\":\"4/4\",\"tempoFeel\":\"str\",\"difficulty\":\"str\",\"instruments\":\"str\",\"tuning\":null,\"numeralProgression\":\"str\",\"chordNames\":\"str\"," +
    "\"chords\":[{\"name\":\"Am\",\"role\":\"i (tonique)\",\"notes\":\"La – Do – Mi\",\"tip\":\"str\"}]," +
    "\"structure\":[{\"name\":\"str\",\"bars\":4}]," +
    "\"tips\":[\"str\"]," +
    "\"drumPattern\":{\"kick\":[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],\"snare\":[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],\"hhc\":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],\"hho\":[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],\"crash\":[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}," +
    "\"youtubeUrl\":\"https://youtube.com/watch?v=ID\",\"tutorialUrl\":\"https://youtube.com/results?search_query=TITRE+ARTISTE+tutorial\",\"chordsUrl\":\"https://www.ultimate-guitar.com/search.php?search_type=title&value=TITRE+ARTISTE\"}";
};

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
    setLoading(true); setError(""); setSuggestions([]);
    try {
      const text = await callAPI([{role:"user",content:PROMPT(title)}],1500);
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Pas de JSON dans la réponse");
      setSong(JSON.parse(match[0]));
      setInput("");
    } catch(e) { setError("Erreur : " + e.message); }
    setLoading(false);
  }

  async function fetchSuggestions(val) {
    if (!val.trim()||val.includes("–")||val.includes("-")) { setSuggestions([]); return; }
    setSuggLoading(true);
    try {
      const q = "L'utilisateur tape \"" + val + "\". Si c'est un artiste connu, réponds UNIQUEMENT en JSON : {\"artist\":\"nom\",\"titles\":[\"t1\",\"t2\",\"t3\",\"t4\",\"t5\"]}. Sinon : {\"artist\":null,\"titles\":[]}.";
      const text = await callAPI([{role:"user",content:q}],200);
      const match = text.match(/\{[\s\S]*\}/);
      if (match) setSuggestions(JSON.parse(match[0]).titles||[]);
    } catch { setSuggestions([]); }
    setSuggLoading(false);
  }

  function fetchRandom() {
    const pick = RANDOM_POOL[Math.floor(Math.random()*RANDOM_POOL.length)];
    setInput(pick);
    fetchSongByTitle(pick);
  }

  return (
    <div style={{padding:"16px 0",fontFamily:"var(--font-sans,sans-serif)"}}>
      <div style={{display:"flex",gap:8,marginBottom:suggestions.length?0:24,background:"#f8fafc",borderRadius:12,padding:12,border:"1px solid #e2e8f0"}}>
        <input value={input} onChange={e=>{setInput(e.target.value);fetchSuggestions(e.target.value);}} onKeyDown={e=>e.key==="Enter"&&fetchSongByTitle(input)} placeholder="Artiste ou Artiste – Titre" style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",color:"#1e293b"}}/>
        {suggLoading&&<span style={{fontSize:13,color:"#94a3b8",alignSelf:"center"}}>…</span>}
        <button onClick={fetchRandom} disabled={loading} title="Aléatoire" style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:8,padding:"8px 12px",fontSize:18,cursor:"pointer"}}>🎲</button>
        <button onClick={()=>fetchSongByTitle(input)} disabled={loading||!input.trim()} style={{background:loading?"#a5b4fc":"#6366f1",color:"#fff",border:"none",borderRadius:8,padding:"8px 20px",fontSize:14,fontWeight:600,cursor:loading?"default":"pointer",whiteSpace:"nowrap"}}>
          {loading?"Analyse…":"Analyser ▶"}
        </button>
      </div>
      {suggestions.length>0&&(
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"0 0 10px 10px",marginBottom:16,overflow:"hidden"}}>
          {suggestions.map((t,i)=>(
            <div key={i} onClick={()=>fetchSongByTitle(t)} style={{padding:"9px 16px",fontSize:13,cursor:"pointer",borderBottom:i<suggestions.length-1?"1px solid #f1f5f9":"none",display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background="#eef2ff"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              <span style={{color:"#6366f1"}}>♪</span> {t}
            </div>
          ))}
        </div>
      )}
      {error&&<div style={{color:"#dc2626",fontSize:13,marginBottom:12}}>{error}</div>}
      <SongCard song={song}/>
    </div>
  );
}