import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, Legend
} from "recharts";

// ─── PROGRAM DATA ────────────────────────────────────────────────────────────
const PROGRAM = {
  LUNES: {
    label: "LUNES", focus: "Empuje Horizontal + Core", color: "#E8FF47", icon: "◈",
    exercises: [
      { id: "L1", name: "Push-up Archer", sets: 4, reps: "6/lado", weight: "PC", equipment: "PC", notes: "Brazo apoyo extendido. Excéntrico 3s." },
      { id: "L2", name: "Press Mancuerna Inclinado", sets: 4, reps: "8-10", weight: "2×8kg", equipment: "Mancuernas", notes: "En suelo, espalda neutra. Pectoral superior." },
      { id: "L3", name: "Fly Mancuerna Suelo", sets: 3, reps: "12", weight: "2×6kg", equipment: "Mancuernas", notes: "Pausa contracción 2s. Rango limitado por suelo." },
      { id: "L4", name: "Dips + Lastre", sets: 4, reps: "10-12", weight: "PC + MB 6kg", equipment: "PC + Macebell", notes: "Torso adelante para activar pectoral." },
      { id: "L5", name: "Hollow Body Hold", sets: 4, reps: "30s", weight: "PC", equipment: "PC", notes: "Lumbar pegada al suelo, brazos extendidos." },
      { id: "L6", name: "Dead Bug Mancuerna", sets: 3, reps: "8/lado", weight: "1×4kg", equipment: "Mancuerna", notes: "Brazo extendido al techo. Lento y controlado." },
    ],
  },
  MARTES: {
    label: "MARTES", focus: "Tracción Vertical + Bíceps", color: "#FF6B47", icon: "⇅",
    exercises: [
      { id: "M1", name: "Dominadas Lastre (prono)", sets: 5, reps: "4-6", weight: "PC + MB 6-8kg", equipment: "Barra + Macebell", notes: "Techo bajo: recoge rodillas. Escápulas deprimidas." },
      { id: "M2", name: "Chin-up Lastre (supino)", sets: 4, reps: "5-7", weight: "PC + MB 5kg", equipment: "Barra + Macebell", notes: "Énfasis bíceps. Misma adaptación rodillas." },
      { id: "M3", name: "Dominadas Australianas", sets: 3, reps: "12-15", weight: "PC", equipment: "Barra baja", notes: "Cuerpo rígido, pecho a barra." },
      { id: "M4", name: "Curl Mancuerna Alterno", sets: 4, reps: "10/lado", weight: "1×8kg", equipment: "Mancuerna", notes: "Supinación completa. Sin balanceo de cadera." },
      { id: "M5", name: "Curl Martillo Bilateral", sets: 3, reps: "12", weight: "2×7kg", equipment: "Mancuernas", notes: "Agarre neutro. Braquial y braquiorradial." },
      { id: "M6", name: "Face Pull (toalla)", sets: 3, reps: "15", weight: "PC", equipment: "Barra + Toalla", notes: "Cuerpo en ángulo, tirar hacia la cara." },
    ],
  },
  MIERCOLES: {
    label: "MIÉRCOLES", focus: "Pierna + Potencia Inferior", color: "#47BFFF", icon: "⚡",
    exercises: [
      { id: "X1", name: "Jump Squat → Goblet", sets: 5, reps: "3+5", weight: "MB 8kg", equipment: "Macebell", notes: "3 saltos máximos → 5 goblet sin pausa. Complejo explosivo." },
      { id: "X2", name: "Sentadilla Búlgara", sets: 4, reps: "8/lado", weight: "2×8kg", equipment: "Mancuernas", notes: "Pie trasero en silla. Rodilla no sobrepasa pie." },
      { id: "X3", name: "Romanian Deadlift", sets: 4, reps: "10", weight: "2×10kg", equipment: "Mancuernas", notes: "Bisagra cadera. Pausa 1s al límite de isquios." },
      { id: "X4", name: "Step-up Explosivo", sets: 3, reps: "8/lado", weight: "MB 6kg offset", equipment: "Macebell", notes: "Empuje con pie elevado. Bajar controlado." },
      { id: "X5", name: "Glute Bridge Unilateral", sets: 3, reps: "12/lado", weight: "1×10kg", equipment: "Mancuerna", notes: "Un pie elevado. Máxima extensión de cadera." },
      { id: "X6", name: "Calf Raise Explosivo", sets: 4, reps: "15", weight: "2×10kg", equipment: "Mancuernas", notes: "Subida rápida, bajada lenta 3s." },
    ],
  },
  JUEVES: {
    label: "JUEVES", focus: "Empuje Vertical + Tríceps", color: "#B47FFF", icon: "▲",
    exercises: [
      { id: "J1", name: "Pike Push-up Elevado", sets: 4, reps: "8-10", weight: "PC", equipment: "PC + Silla", notes: "Pies en silla, caderas 90°. Simula press militar." },
      { id: "J2", name: "Macebell Halos + Press", sets: 4, reps: "5+5/lado", weight: "MB 6-7kg", equipment: "Macebell", notes: "Órbita completa cabeza → press unilateral." },
      { id: "J3", name: "Press Arnold", sets: 3, reps: "10", weight: "2×8kg", equipment: "Mancuernas", notes: "Supino a prono al subir. 3 haces del deltoides." },
      { id: "J4", name: "Extensión Tríceps Francés", sets: 4, reps: "10-12", weight: "2×6kg", equipment: "Mancuernas", notes: "Tumbado en suelo. Codos fijos al techo." },
      { id: "J5", name: "Diamond Push-up", sets: 3, reps: "12-15", weight: "PC", equipment: "PC", notes: "Manos en diamante. Codos pegados al torso." },
      { id: "J6", name: "Lateral Raise Macebell", sets: 3, reps: "12/lado", weight: "MB 4kg", equipment: "Macebell", notes: "Offset activa deltoides medio." },
    ],
  },
  VIERNES: {
    label: "VIERNES", focus: "Tracción Horizontal + Core Rotatorio", color: "#FF47A3", icon: "↔",
    exercises: [
      { id: "V1", name: "Remo Pendlay Unilateral", sets: 5, reps: "6/lado", weight: "1×10kg", equipment: "Mancuerna", notes: "Torso paralelo suelo. Parte del suelo cada rep." },
      { id: "V2", name: "Remo Bent-over Bilateral", sets: 4, reps: "10", weight: "2×9kg", equipment: "Mancuernas", notes: "Cadera 45°. Retracción escapular arriba." },
      { id: "V3", name: "Swing Macebell 360°", sets: 4, reps: "8/lado", weight: "MB 7-8kg", equipment: "Macebell", notes: "Círculo completo cabeza alternando lados." },
      { id: "V4", name: "Woodchop Macebell", sets: 3, reps: "10/lado", weight: "MB 5kg", equipment: "Macebell", notes: "Diagonal alto-bajo. Rotación desde cadera." },
      { id: "V5", name: "Renegade Row", sets: 3, reps: "6/lado", weight: "2×8kg", equipment: "Mancuernas", notes: "Plank sin rotación de cadera. Core antirotatorio." },
      { id: "V6", name: "Superman Hold", sets: 3, reps: "20s", weight: "PC", equipment: "PC", notes: "Brazos en T. Extensores lumbares." },
    ],
  },
  EXTRA: {
    label: "EXTRA", focus: "Movilidad / Metabólico / Skill", color: "#47FFB4", icon: "∞",
    exercises: [
      { id: "E1", name: "Macebell Halos Lentos", sets: 3, reps: "10/lado", weight: "MB 4kg", equipment: "Macebell", notes: "Movilidad escapular y torácica." },
      { id: "E2", name: "Windmill Macebell", sets: 3, reps: "6/lado", weight: "MB 5kg", equipment: "Macebell", notes: "Cadena posterior + movilidad lateral." },
      { id: "E3", name: "Colgarse Pasivo Barra", sets: 5, reps: "30s", weight: "PC", equipment: "Barra", notes: "Descompresión lumbar y hombros." },
      { id: "E4", name: "Hip 90/90 Stretch", sets: 3, reps: "60s/lado", weight: "PC", equipment: "PC", notes: "Rotadores de cadera." },
      { id: "E5", name: "EMOM Metabólico 20min", sets: 5, reps: "20min", weight: "Variable", equipment: "MB + PC", notes: "Min1: Swings 360°·6kg | Min2: Jump Squat | Min3: Renegade Row·6kg | Min4: Mountain Climbers" },
      { id: "E6", name: "L-sit en Sillas", sets: 6, reps: "hold max", weight: "PC", equipment: "PC + Sillas", notes: "Skill work. Registra tiempo." },
    ],
  },
};

const DAYS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "EXTRA"];
const LS_KEY = "pablo_lift_v2";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const uid = () => Math.random().toString(36).slice(2, 9);
const getWeek = () => {
  const d = new Date(), start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
};
const fmtDate = (d) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}`;
};
const parseWeight = (str) => {
  if (!str) return 0;
  const match = str.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
};
const calcVolume = (session) => {
  if (!session?.exercises) return 0;
  return session.exercises.reduce((total, ex) => {
    return total + ex.sets.reduce((s, set) => {
      const w = parseWeight(set.weight_config) || 0;
      const r = set.reps_actual || 0;
      return s + w * r;
    }, 0);
  }, 0);
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const loadData = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : { sessions: {}, bodyweight: {} };
  } catch { return { sessions: {}, bodyweight: {} }; }
};
const saveData = (data) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const inputStyle = {
  background: "#111", border: "1px solid #222", color: "#e0e0e0",
  padding: "5px 7px", borderRadius: 4, fontSize: 12,
  fontFamily: "monospace", width: "100%", boxSizing: "border-box", outline: "none",
};
const cardStyle = {
  background: "#0d0d0d", border: "1px solid #1a1a1a",
  borderRadius: 8, padding: 16, marginBottom: 10,
};
const btnBase = {
  border: "none", cursor: "pointer", borderRadius: 5,
  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 1,
};

// ─── RPE DOTS ─────────────────────────────────────────────────────────────────
const RPEDots = ({ value, onChange, size = 14 }) => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
    {[...Array(10)].map((_, i) => {
      const v = i + 1;
      const active = v <= value;
      const color = v <= 4 ? "#47FFB4" : v <= 7 ? "#E8FF47" : "#FF6B47";
      return (
        <button key={v} onClick={() => onChange(v === value ? 0 : v)} style={{
          width: size, height: size, borderRadius: "50%",
          border: `1.5px solid ${active ? color : "#2a2a2a"}`,
          background: active ? color : "transparent",
          cursor: "pointer", padding: 0, transition: "all 0.1s",
          flexShrink: 0,
        }} />
      );
    })}
    <span style={{ fontFamily: "monospace", fontSize: 10, color: "#555", marginLeft: 2 }}>
      {value ? `${value}/10` : "—"}
    </span>
  </div>
);

// ─── SET ROW ──────────────────────────────────────────────────────────────────
const SetRow = ({ set, setIndex, onUpdate, accent }) => {
  const done = set.reps_actual != null && set.reps_actual > 0;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "24px 1fr 1fr auto",
      gap: 8, alignItems: "start", padding: "10px 0",
      borderBottom: "1px solid #161616",
      opacity: done ? 1 : 0.7,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", marginTop: 18,
        background: done ? accent + "33" : "#1a1a1a",
        border: `1px solid ${done ? accent : "#2a2a2a"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color: done ? accent : "#444", fontFamily: "monospace",
      }}>
        {setIndex + 1}
      </div>
      <div>
        <div style={{ fontSize: 9, color: "#444", marginBottom: 4, fontFamily: "monospace", letterSpacing: 0.5 }}>REPS</div>
        <input type="number" min={0} max={999} value={set.reps_actual ?? ""} placeholder={set.reps_target}
          onChange={e => onUpdate("reps_actual", parseInt(e.target.value) || null)}
          style={{ ...inputStyle, borderColor: done ? accent + "44" : "#222" }} />
      </div>
      <div>
        <div style={{ fontSize: 9, color: "#444", marginBottom: 4, fontFamily: "monospace", letterSpacing: 0.5 }}>PESO</div>
        <input type="text" value={set.weight_config ?? ""} placeholder="—"
          onChange={e => onUpdate("weight_config", e.target.value)}
          style={inputStyle} />
      </div>
      <div style={{ minWidth: 100 }}>
        <div style={{ fontSize: 9, color: "#444", marginBottom: 6, fontFamily: "monospace", letterSpacing: 0.5 }}>RPE</div>
        <RPEDots value={set.rpe ?? 0} onChange={v => onUpdate("rpe", v)} size={12} />
      </div>
    </div>
  );
};

// ─── EXERCISE CARD ────────────────────────────────────────────────────────────
const ExerciseCard = ({ ex, exData, accent, onUpdateSet }) => {
  const [open, setOpen] = useState(false);
  const doneSets = exData?.sets?.filter(s => s.reps_actual != null && s.reps_actual > 0).length ?? 0;
  const totalSets = ex.sets;
  const complete = doneSets >= totalSets;
  const bestSet = exData?.sets?.reduce((best, s) => {
    const vol = (s.reps_actual || 0) * parseWeight(s.weight_config);
    return vol > best ? vol : best;
  }, 0);

  return (
    <div style={{
      border: `1px solid ${open ? accent + "55" : complete ? accent + "22" : "#1a1a1a"}`,
      borderRadius: 8, marginBottom: 8, overflow: "hidden",
      background: complete ? accent + "05" : "#0a0a0a",
      transition: "border-color 0.2s",
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        padding: "13px 14px", display: "flex", justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: "monospace", fontSize: 9, color: accent,
            background: accent + "1a", padding: "3px 6px", borderRadius: 3, flexShrink: 0,
          }}>{ex.id}</span>
          <div style={{ textAlign: "left", minWidth: 0 }}>
            <div style={{
              color: "#e8e8e8", fontSize: 13, fontWeight: 600,
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{ex.name}</div>
            <div style={{ color: "#444", fontSize: 10, fontFamily: "monospace" }}>
              {ex.sets}×{ex.reps} · {ex.weight}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 8 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[...Array(totalSets)].map((_, i) => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: "50%",
                background: i < doneSets ? accent : "#222",
              }} />
            ))}
          </div>
          {complete && <span style={{ fontSize: 10, color: accent }}>✓</span>}
          <span style={{ color: "#333", fontSize: 12 }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid #141414" }}>
          <div style={{
            background: "#080808", borderLeft: `2px solid ${accent}44`,
            padding: "7px 10px", margin: "10px 0 6px", borderRadius: "0 4px 4px 0",
          }}>
            <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>📋 {ex.notes}</span>
          </div>
          {exData?.sets?.map((set, si) => (
            <SetRow key={si} set={set} setIndex={si} accent={accent}
              onUpdate={(field, val) => onUpdateSet(ex.id, si, field, val)} />
          ))}
          {bestSet > 0 && (
            <div style={{ marginTop: 8, fontSize: 10, color: "#444", fontFamily: "monospace" }}>
              MEJOR SET SESIÓN: <span style={{ color: accent }}>{bestSet.toFixed(0)} kg·rep</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MINI CHART (for analytics) ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, accent }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0d0d0d", border: `1px solid ${accent}44`,
      borderRadius: 6, padding: "8px 12px", fontFamily: "monospace", fontSize: 11,
    }}>
      <div style={{ color: "#666", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || accent }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</div>
      ))}
    </div>
  );
};

// ─── ANALYTICS TAB ───────────────────────────────────────────────────────────
const AnalyticsTab = ({ allSessions }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("volume");

  const sessionList = useMemo(() =>
    Object.values(allSessions).sort((a, b) => a.date.localeCompare(b.date)),
    [allSessions]
  );

  // All unique exercises across all sessions
  const allExercises = useMemo(() => {
    const map = {};
    sessionList.forEach(s => {
      s.exercises?.forEach(ex => { if (ex.name) map[ex.name] = true; });
    });
    return Object.keys(map).sort();
  }, [sessionList]);

  useEffect(() => {
    if (allExercises.length && !selectedExercise) setSelectedExercise(allExercises[0]);
  }, [allExercises]);

  // Volume per day
  const volumeData = useMemo(() =>
    sessionList.map(s => ({
      date: fmtDate(s.date),
      volume: Math.round(calcVolume(s)),
      day: s.day_label,
      rpe: s.overall_rpe || 0,
    })),
    [sessionList]
  );

  // Per-exercise progression
  const exerciseData = useMemo(() => {
    if (!selectedExercise) return [];
    const points = [];
    sessionList.forEach(s => {
      const ex = s.exercises?.find(e => e.name === selectedExercise);
      if (!ex) return;
      const validSets = ex.sets.filter(st => st.reps_actual > 0);
      if (!validSets.length) return;
      const maxWeight = Math.max(...validSets.map(st => parseWeight(st.weight_config)));
      const totalReps = validSets.reduce((a, st) => a + (st.reps_actual || 0), 0);
      const avgRpe = validSets.reduce((a, st) => a + (st.rpe || 0), 0) / validSets.length;
      const vol = validSets.reduce((a, st) => a + (st.reps_actual || 0) * parseWeight(st.weight_config), 0);
      points.push({ date: fmtDate(s.date), maxWeight, totalReps, avgRpe: +avgRpe.toFixed(1), volume: Math.round(vol) });
    });
    return points;
  }, [selectedExercise, sessionList]);

  // Frequency heatmap data (sessions per day-of-week)
  const freqData = useMemo(() => {
    const map = { LUNES: 0, MARTES: 0, MIERCOLES: 0, JUEVES: 0, VIERNES: 0, EXTRA: 0 };
    sessionList.forEach(s => { if (map[s.day_label] !== undefined) map[s.day_label]++; });
    return Object.entries(map).map(([day, count]) => ({
      day: day === "MIERCOLES" ? "MIÉRC." : day,
      sesiones: count,
    }));
  }, [sessionList]);

  // Weekly volume trend
  const weeklyData = useMemo(() => {
    const map = {};
    sessionList.forEach(s => {
      const w = `S${s.week_number}`;
      map[w] = (map[w] || 0) + calcVolume(s);
    });
    return Object.entries(map).map(([week, vol]) => ({ week, volumen: Math.round(vol) }));
  }, [sessionList]);

  // Stats cards
  const totalSessions = sessionList.length;
  const totalVolume = sessionList.reduce((a, s) => a + calcVolume(s), 0);
  const avgRpe = sessionList.length
    ? (sessionList.reduce((a, s) => a + (s.overall_rpe || 0), 0) / sessionList.filter(s => s.overall_rpe).length || 0).toFixed(1)
    : 0;
  const streak = useMemo(() => {
    const dates = [...new Set(sessionList.map(s => s.date))].sort().reverse();
    if (!dates.length) return 0;
    let count = 0;
    let cur = new Date(todayStr());
    for (const d of dates) {
      const diff = Math.round((cur - new Date(d)) / 86400000);
      if (diff > 1) break;
      count++;
      cur = new Date(d);
    }
    return count;
  }, [sessionList]);

  if (!sessionList.length) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, color: "#333", letterSpacing: 2 }}>
        SIN DATOS AÚN
      </div>
      <div style={{ fontSize: 12, color: "#444", marginTop: 8, fontFamily: "monospace" }}>
        Completa al menos una sesión para ver estadísticas
      </div>
    </div>
  );

  const CHART_COLORS = ["#E8FF47", "#FF6B47", "#47BFFF", "#B47FFF", "#FF47A3", "#47FFB4"];

  return (
    <div style={{ padding: "0 20px 20px" }}>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { label: "SESIONES", value: totalSessions, color: "#E8FF47" },
          { label: "RACHA DÍAS", value: `${streak}🔥`, color: "#FF6B47" },
          { label: "VOL. TOTAL", value: `${(totalVolume / 1000).toFixed(1)}t`, color: "#47BFFF" },
          { label: "RPE MEDIO", value: avgRpe || "—", color: "#B47FFF" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ ...cardStyle, padding: "14px 16px" }}>
            <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Volumen por sesión */}
      <div style={{ ...cardStyle }}>
        <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 1, marginBottom: 14 }}>
          VOLUMEN POR SESIÓN (kg·rep)
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={volumeData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="date" tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} />
            <YAxis tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} />
            <Tooltip content={<CustomTooltip accent="#E8FF47" />} />
            <Bar dataKey="volume" fill="#E8FF47" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RPE por sesión */}
      <div style={{ ...cardStyle }}>
        <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 1, marginBottom: 14 }}>
          RPE GLOBAL POR SESIÓN
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={volumeData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="date" tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} />
            <YAxis domain={[0, 10]} tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} />
            <Tooltip content={<CustomTooltip accent="#FF6B47" />} />
            <Line type="monotone" dataKey="rpe" stroke="#FF6B47" strokeWidth={2} dot={{ fill: "#FF6B47", r: 3 }} name="RPE" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Frecuencia por día */}
      <div style={{ ...cardStyle }}>
        <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 1, marginBottom: 14 }}>
          FRECUENCIA POR DÍA
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={freqData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="day" tick={{ fill: "#444", fontSize: 8, fontFamily: "monospace" }} />
            <YAxis tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip accent="#47BFFF" />} />
            <Bar dataKey="sesiones" fill="#47BFFF" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Exercise progression */}
      <div style={{ ...cardStyle }}>
        <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 1, marginBottom: 10 }}>
          PROGRESIÓN POR EJERCICIO
        </div>
        <select
          value={selectedExercise ?? ""}
          onChange={e => setSelectedExercise(e.target.value)}
          style={{ ...inputStyle, marginBottom: 10 }}
        >
          {allExercises.map(e => <option key={e} value={e}>{e}</option>)}
        </select>

        {/* Metric selector */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {[
            { key: "maxWeight", label: "PESO MÁX", color: "#E8FF47" },
            { key: "totalReps", label: "REPS TOTAL", color: "#47BFFF" },
            { key: "volume", label: "VOLUMEN", color: "#B47FFF" },
            { key: "avgRpe", label: "RPE MEDIO", color: "#FF47A3" },
          ].map(({ key, label, color }) => (
            <button key={key} onClick={() => setSelectedMetric(key)} style={{
              ...btnBase, padding: "4px 10px", fontSize: 10,
              background: selectedMetric === key ? color + "22" : "transparent",
              border: `1px solid ${selectedMetric === key ? color : "#222"}`,
              color: selectedMetric === key ? color : "#444",
            }}>{label}</button>
          ))}
        </div>

        {exerciseData.length > 0 ? (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={exerciseData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} />
              <YAxis tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} />
              <Tooltip content={<CustomTooltip accent={CHART_COLORS[0]} />} />
              <Line type="monotone" dataKey={selectedMetric}
                stroke={CHART_COLORS[0]} strokeWidth={2}
                dot={{ fill: CHART_COLORS[0], r: 4 }}
                name={selectedMetric} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", padding: 20, color: "#333", fontSize: 11, fontFamily: "monospace" }}>
            Sin datos para este ejercicio aún
          </div>
        )}
      </div>

      {/* Weekly volume */}
      {weeklyData.length > 1 && (
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 1, marginBottom: 14 }}>
            VOLUMEN SEMANAL TOTAL
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={weeklyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="week" tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} />
              <YAxis tick={{ fill: "#444", fontSize: 9, fontFamily: "monospace" }} />
              <Tooltip content={<CustomTooltip accent="#47FFB4" />} />
              <Line type="monotone" dataKey="volumen" stroke="#47FFB4" strokeWidth={2}
                dot={{ fill: "#47FFB4", r: 3 }} name="Vol (kg·rep)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// ─── HISTORY TAB ─────────────────────────────────────────────────────────────
const HistoryTab = ({ allSessions, onDeleteSession }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const sorted = Object.entries(allSessions)
    .sort(([, a], [, b]) => b.date.localeCompare(a.date));

  if (!sorted.length) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", letterSpacing: 2 }}>
        NO HAY SESIONES GUARDADAS
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 20px 20px" }}>
      {sorted.map(([key, session]) => {
        const dayConfig = PROGRAM[session.day_label];
        const accent = dayConfig?.color ?? "#888";
        const vol = calcVolume(session);
        const isOpen = expandedId === key;
        return (
          <div key={key} style={{
            border: `1px solid ${isOpen ? accent + "44" : "#1a1a1a"}`,
            borderRadius: 8, marginBottom: 8, overflow: "hidden",
            background: "#0a0a0a",
          }}>
            <button onClick={() => setExpandedId(isOpen ? null : key)} style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontFamily: "monospace", fontSize: 9, color: accent,
                  background: accent + "1a", padding: "2px 6px", borderRadius: 3,
                }}>{session.day_label}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#e0e0e0", fontSize: 12, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5 }}>
                    {session.date}
                  </div>
                  <div style={{ color: "#444", fontSize: 10, fontFamily: "monospace" }}>
                    Vol: {vol > 0 ? `${vol.toFixed(0)} kg·rep` : "—"} · RPE: {session.overall_rpe ?? "—"}
                  </div>
                </div>
              </div>
              <span style={{ color: "#333", fontSize: 11 }}>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div style={{ padding: "0 14px 14px", borderTop: "1px solid #141414" }}>
                {session.exercises?.map((ex, i) => {
                  const doneSets = ex.sets.filter(s => s.reps_actual > 0);
                  if (!doneSets.length) return null;
                  return (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: "#ccc", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>
                        {ex.name}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {doneSets.map((s, si) => (
                          <span key={si} style={{
                            fontSize: 10, fontFamily: "monospace", color: "#666",
                            background: "#111", padding: "2px 7px", borderRadius: 3,
                            border: "1px solid #1a1a1a",
                          }}>
                            {s.reps_actual}r · {s.weight_config || "PC"}{s.rpe ? ` · RPE${s.rpe}` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {session.notes && (
                  <div style={{
                    marginTop: 8, fontSize: 11, color: "#555",
                    fontFamily: "monospace", fontStyle: "italic",
                    borderLeft: `2px solid ${accent}33`, paddingLeft: 8,
                  }}>
                    {session.notes}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                  {confirmDelete === key ? (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#FF6B47", fontFamily: "monospace" }}>¿Seguro?</span>
                      <button onClick={() => { onDeleteSession(key); setConfirmDelete(null); setExpandedId(null); }} style={{
                        ...btnBase, padding: "4px 10px", fontSize: 10,
                        background: "#FF6B4722", border: "1px solid #FF6B47", color: "#FF6B47",
                      }}>BORRAR</button>
                      <button onClick={() => setConfirmDelete(null)} style={{
                        ...btnBase, padding: "4px 10px", fontSize: 10,
                        background: "#1a1a1a", border: "1px solid #333", color: "#888",
                      }}>CANCELAR</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(key)} style={{
                      ...btnBase, padding: "4px 10px", fontSize: 10,
                      background: "transparent", border: "1px solid #2a2a2a", color: "#444",
                    }}>🗑 Borrar sesión</button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function WorkoutApp() {
  const [tab, setTab] = useState("workout"); // workout | analytics | history
  const [activeDay, setActiveDay] = useState("LUNES");
  const [appData, setAppData] = useState(() => loadData());
  const [timer, setTimer] = useState(null); // null | { start, paused, elapsed }
  const [timerDisplay, setTimerDisplay] = useState("00:00");
  const [showExportModal, setShowExportModal] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  const day = PROGRAM[activeDay];
  const sessionKey = `${activeDay}_${todayStr()}`;
  const currentSession = appData.sessions[sessionKey];

  // Persist on every change
  useEffect(() => { saveData(appData); }, [appData]);

  // Timer
  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => {
      const elapsed = timer.paused
        ? timer.elapsed
        : timer.elapsed + Math.floor((Date.now() - timer.start) / 1000);
      const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      setTimerDisplay(`${m}:${s}`);
    }, 500);
    return () => clearInterval(interval);
  }, [timer]);

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  const initSession = useCallback(() => {
    if (appData.sessions[sessionKey]) return;
    const newSession = {
      session_id: uid(), date: todayStr(), week_number: getWeek(),
      day_label: activeDay, focus: day.focus,
      overall_rpe: null, notes: "",
      exercises: day.exercises.map(ex => ({
        exercise_id: ex.id, name: ex.name, equipment: ex.equipment,
        sets: Array(ex.sets).fill(null).map(() => ({
          reps_target: ex.reps, reps_actual: null,
          weight_config: ex.weight, rpe: null,
        })),
      })),
    };
    setAppData(d => ({ ...d, sessions: { ...d.sessions, [sessionKey]: newSession } }));
    // Start timer
    setTimer({ start: Date.now(), elapsed: 0, paused: false });
  }, [appData, sessionKey, activeDay, day]);

  const updateSet = useCallback((exId, setIndex, field, val) => {
    setAppData(prev => {
      const s = JSON.parse(JSON.stringify(prev.sessions[sessionKey]));
      const exIdx = s.exercises.findIndex(e => e.exercise_id === exId);
      if (exIdx === -1) return prev;
      s.exercises[exIdx].sets[setIndex][field] = val;
      return { ...prev, sessions: { ...prev.sessions, [sessionKey]: s } };
    });
  }, [sessionKey]);

  const updateSessionField = useCallback((field, val) => {
    setAppData(prev => ({
      ...prev,
      sessions: {
        ...prev.sessions,
        [sessionKey]: { ...prev.sessions[sessionKey], [field]: val },
      },
    }));
  }, [sessionKey]);

  const saveSession = () => {
    // Already auto-saved; just flash feedback
    if (timer && !timer.paused) {
      const elapsed = timer.elapsed + Math.floor((Date.now() - timer.start) / 1000);
      updateSessionField("duration_minutes", Math.round(elapsed / 60));
      setTimer(t => ({ ...t, paused: true, elapsed }));
    }
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const deleteSession = useCallback((key) => {
    setAppData(prev => {
      const s = { ...prev.sessions };
      delete s[key];
      return { ...prev, sessions: s };
    });
  }, []);

  const getProgress = () => {
    if (!currentSession) return 0;
    const total = currentSession.exercises.reduce((a, ex) => a + ex.sets.length, 0);
    const done = currentSession.exercises.reduce(
      (a, ex) => a + ex.sets.filter(s => s.reps_actual != null && s.reps_actual > 0).length, 0
    );
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const progress = getProgress();

  const toggleTimer = () => {
    if (!timer) return;
    if (timer.paused) {
      setTimer({ start: Date.now(), elapsed: timer.elapsed, paused: false });
    } else {
      const elapsed = timer.elapsed + Math.floor((Date.now() - timer.start) / 1000);
      setTimer({ ...timer, elapsed, paused: true });
    }
  };

  const lastSameDay = useMemo(() => {
    const entries = Object.entries(appData.sessions)
      .filter(([k, s]) => s.day_label === activeDay && k !== sessionKey)
      .sort(([, a], [, b]) => b.date.localeCompare(a.date));
    return entries[0]?.[1] ?? null;
  }, [appData.sessions, activeDay, sessionKey]);

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", color: "#e0e0e0",
      fontFamily: "'Barlow', sans-serif", maxWidth: 680, margin: "0 auto",
    }}>
      {/* ── HEADER ── */}
      <div style={{
        padding: "20px 20px 0", position: "sticky", top: 0,
        background: "linear-gradient(to bottom, #080808 85%, transparent)",
        zIndex: 50,
      }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800,
              letterSpacing: 3, color: day.color, lineHeight: 1,
            }}>PABLO.LIFT</div>
            <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginTop: 2 }}>
              {todayStr()} · W{getWeek()}
            </div>
          </div>

          {/* Timer */}
          {timer && tab === "workout" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={toggleTimer} style={{
                background: timer.paused ? "#1a1a1a" : day.color + "22",
                border: `1px solid ${timer.paused ? "#2a2a2a" : day.color + "55"}`,
                color: timer.paused ? "#444" : day.color,
                padding: "5px 10px", borderRadius: 4, cursor: "pointer",
                fontFamily: "monospace", fontSize: 14, letterSpacing: 1,
              }}>
                {timer.paused ? "▶" : "⏸"} {timerDisplay}
              </button>
            </div>
          )}
        </div>

        {/* Navigation tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1a1a1a", marginBottom: 0 }}>
          {[
            { key: "workout", label: "ENTRENO" },
            { key: "analytics", label: "STATS" },
            { key: "history", label: "HISTORIAL" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              ...btnBase, padding: "9px 16px", fontSize: 11,
              background: "none", border: "none",
              borderBottom: `2px solid ${tab === key ? day.color : "transparent"}`,
              color: tab === key ? day.color : "#444",
              borderRadius: 0, letterSpacing: 1.5,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── WORKOUT TAB ── */}
      {tab === "workout" && (
        <>
          {/* Day selector */}
          <div style={{ padding: "12px 20px 0", position: "sticky", top: 88, background: "#080808", zIndex: 40 }}>
            <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
              {DAYS.map(d => {
                const dp = PROGRAM[d];
                const isActive = d === activeDay;
                const hasSession = !!appData.sessions[`${d}_${todayStr()}`];
                return (
                  <button key={d} onClick={() => setActiveDay(d)} style={{
                    flexShrink: 0,
                    background: isActive ? dp.color : "#0d0d0d",
                    border: `1px solid ${isActive ? dp.color : hasSession ? dp.color + "44" : "#1e1e1e"}`,
                    color: isActive ? "#000" : hasSession ? dp.color : "#555",
                    padding: "6px 11px", borderRadius: 5, cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11, fontWeight: isActive ? 700 : 400, letterSpacing: 0.8,
                    transition: "all 0.15s",
                  }}>
                    {dp.icon} {d === "MIERCOLES" ? "MIÉRC" : d}
                    {hasSession && !isActive && <span style={{ marginLeft: 4, fontSize: 7 }}>●</span>}
                  </button>
                );
              })}
            </div>

            {/* Day header */}
            <div style={{ ...cardStyle, marginBottom: 12, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700,
                    color: "#e0e0e0", letterSpacing: 0.8,
                  }}>{day.focus.toUpperCase()}</div>
                  {lastSameDay && (
                    <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace", marginTop: 1 }}>
                      Última: {lastSameDay.date} · Vol {calcVolume(lastSameDay).toFixed(0)} kg·rep
                    </div>
                  )}
                </div>
                <div style={{
                  fontFamily: "monospace", fontSize: 22, fontWeight: 700,
                  color: progress === 100 ? day.color : progress > 0 ? day.color + "88" : "#222",
                }}>
                  {currentSession ? `${progress}%` : "—"}
                </div>
              </div>
              {currentSession && (
                <div style={{ background: "#141414", borderRadius: 2, height: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${progress}%`, background: day.color,
                    transition: "width 0.4s", boxShadow: progress > 0 ? `0 0 6px ${day.color}88` : "none",
                  }} />
                </div>
              )}
            </div>
          </div>

          {/* Exercises */}
          <div style={{ padding: "0 20px 100px" }}>
            {!currentSession ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{day.icon}</div>
                {lastSameDay && (
                  <div style={{
                    ...cardStyle, marginBottom: 20, textAlign: "left",
                    borderColor: day.color + "22",
                  }}>
                    <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 1, marginBottom: 8 }}>
                      ÚLTIMA SESIÓN DE {activeDay} — {lastSameDay.date}
                    </div>
                    {lastSameDay.exercises?.slice(0, 3).map((ex, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#888", fontFamily: "'Barlow Condensed', sans-serif" }}>{ex.name}</span>
                        <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>
                          {ex.sets.filter(s => s.reps_actual > 0).map(s => `${s.reps_actual}×${s.weight_config}`).join(" · ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={initSession} style={{
                  background: day.color, color: "#000", border: "none",
                  padding: "14px 36px", borderRadius: 6, cursor: "pointer",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 16, fontWeight: 700, letterSpacing: 2,
                  boxShadow: `0 0 24px ${day.color}44`,
                }}>▶ INICIAR SESIÓN</button>
              </div>
            ) : (
              <>
                {day.exercises.map((ex, i) => (
                  <ExerciseCard key={ex.id} ex={ex}
                    exData={currentSession.exercises[i]}
                    accent={day.color}
                    onUpdateSet={updateSet} />
                ))}

                {/* Session footer */}
                <div style={{ ...cardStyle, marginTop: 8 }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 1, marginBottom: 8 }}>
                      RPE GLOBAL SESIÓN
                    </div>
                    <RPEDots
                      value={currentSession.overall_rpe ?? 0}
                      onChange={v => updateSessionField("overall_rpe", v === currentSession.overall_rpe ? null : v)}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "#444", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>
                      NOTAS
                    </div>
                    <textarea
                      placeholder="Observaciones, sensaciones, ajustes de carga..."
                      value={currentSession.notes ?? ""}
                      onChange={e => updateSessionField("notes", e.target.value)}
                      style={{ ...inputStyle, width: "100%", minHeight: 64, resize: "vertical", lineHeight: 1.5 }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={saveSession} style={{
                    ...btnBase, flex: 1, padding: "13px",
                    background: saveFlash ? day.color + "33" : "#0d0d0d",
                    border: `1px solid ${saveFlash ? day.color : "#2a2a2a"}`,
                    color: saveFlash ? day.color : "#666",
                    fontSize: 12, transition: "all 0.3s",
                  }}>
                    {saveFlash ? "✓ GUARDADO" : "💾 GUARDAR"}
                  </button>
                  <button onClick={() => setShowExportModal(true)} style={{
                    ...btnBase, padding: "13px 16px",
                    background: "#0d0d0d", border: "1px solid #2a2a2a",
                    color: "#555", fontSize: 12,
                  }}>JSON</button>
                </div>

                {progress === 100 && (
                  <button onClick={saveSession} style={{
                    ...btnBase, width: "100%", marginTop: 8, padding: "15px",
                    background: day.color, color: "#000", fontSize: 16, letterSpacing: 2,
                    boxShadow: `0 0 28px ${day.color}55`,
                  }}>✓ SESIÓN COMPLETA</button>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ── ANALYTICS TAB ── */}
      {tab === "analytics" && (
        <div style={{ paddingTop: 16 }}>
          <AnalyticsTab allSessions={appData.sessions} />
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div style={{ paddingTop: 16 }}>
          <HistoryTab allSessions={appData.sessions} onDeleteSession={deleteSession} />
        </div>
      )}

      {/* ── EXPORT MODAL ── */}
      {showExportModal && currentSession && (() => {
        const [copied, setCopied] = useState(false);
        const json = JSON.stringify(currentSession, null, 2);
        return (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16,
          }} onClick={() => setShowExportModal(false)}>
            <div style={{
              background: "#0d0d0d", border: `1px solid ${day.color}33`,
              borderRadius: 10, maxWidth: 580, width: "100%", maxHeight: "75vh",
              overflow: "hidden", display: "flex", flexDirection: "column",
            }} onClick={e => e.stopPropagation()}>
              <div style={{
                padding: "14px 18px", borderBottom: "1px solid #1a1a1a",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ color: day.color, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, letterSpacing: 1 }}>
                  SESSION JSON
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { navigator.clipboard?.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{
                    ...btnBase, padding: "4px 12px", fontSize: 10,
                    background: day.color + "1a", border: `1px solid ${day.color}44`, color: day.color,
                  }}>{copied ? "✓ COPIADO" : "COPIAR"}</button>
                  <button onClick={() => setShowExportModal(false)} style={{
                    ...btnBase, padding: "4px 10px", fontSize: 12,
                    background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#666",
                  }}>✕</button>
                </div>
              </div>
              <pre style={{
                flex: 1, overflow: "auto", padding: 18,
                color: "#5a8a5a", fontSize: 10, fontFamily: "monospace",
                margin: 0, lineHeight: 1.7,
              }}>{json}</pre>
            </div>
          </div>
        );
      })()}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #2a2a2a; }
        input:focus, textarea:focus { border-color: #333 !important; }
        button:active { opacity: 0.75; }
        select option { background: #111; color: #e0e0e0; }
      `}</style>
    </div>
  );
}
