import { collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Obtiene el lunes de una semana dado cualquier día de esa semana
export const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Genera los 7 días de una semana a partir del lunes
export const getWeekDays = (monday) => {
  const days = [];
  const names = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const fullNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      date: d,
      dateStr: d.toISOString().split('T')[0], // YYYY-MM-DD
      short: names[i],
      full: fullNames[i],
      display: `${names[i]} ${d.getDate()} ${d.toLocaleString('es-ES', { month: 'short' })}`,
    });
  }
  return days;
};

// Formatea semana para mostrar: "2 – 8 Jun 2025"
export const formatWeekRange = (monday) => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const opts = { day: 'numeric', month: 'short' };
  return `${monday.toLocaleDateString('es-ES', opts)} – ${sunday.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};

// Clave única para identificar una semana: "2025-W23"
export const getWeekKey = (monday) => {
  const year = monday.getFullYear();
  const start = new Date(year, 0, 1);
  const week = Math.ceil((((monday - start) / 86400000) + start.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

// ── CRUD ────────────────────────────────────────────────────────────────────

export const saveWorkout = async (coachId, athleteId, workout) => {
  const ref = doc(collection(db, 'workouts'));
  await setDoc(ref, {
    ...workout,
    id: ref.id,
    coachId,
    athleteId,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
};

export const updateWorkout = async (id, data) => {
  await updateDoc(doc(db, 'workouts', id), { ...data, updatedAt: new Date().toISOString() });
};

export const deleteWorkout = async (id) => {
  await deleteDoc(doc(db, 'workouts', id));
};

// Escucha entrenamientos de un atleta específico
export const getAthleteWorkoutsForCoach = (coachId, athleteId, cb) => {
  const q = query(collection(db, 'workouts'),
    where('coachId', '==', coachId),
    where('athleteId', '==', athleteId));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

// Escucha entrenamientos del atleta (vista atleta)
export const getMyWorkouts = (athleteId, cb) => {
  const q = query(collection(db, 'workouts'), where('athleteId', '==', athleteId));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

// ── LOGS ────────────────────────────────────────────────────────────────────

export const logSession = async (workoutId, athleteId, athleteName, data) => {
  await setDoc(doc(db, 'workouts', workoutId, 'logs', athleteId),
    { athleteId, athleteName, ...data, loggedAt: new Date().toISOString() }, { merge: true });
};

export const getLogs = async (workoutId) => {
  const snap = await getDocs(collection(db, 'workouts', workoutId, 'logs'));
  return snap.docs.map(d => d.data());
};

export const getMyLog = async (workoutId, athleteId) => {
  const snap = await getDoc(doc(db, 'workouts', workoutId, 'logs', athleteId));
  return snap.exists() ? snap.data() : null;
};
