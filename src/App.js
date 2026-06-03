import React, { useState } from 'react';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import CoachHome from './screens/coach/CoachHome';
import CreateWorkout from './screens/coach/CreateWorkout';
import AthleteFeedback from './screens/coach/AthleteFeedback';
import AthleteHome from './screens/athlete/AthleteHome';
import WorkoutDetail from './screens/athlete/WorkoutDetail';
import LogWorkout from './screens/athlete/LogWorkout';

function AppContent() {
  const { user, userProfile, loading, logout } = useAuth();
  const [screen, setScreen] = useState('main');
  const [authScreen, setAuthScreen] = useState('login');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [createDate, setCreateDate] = useState(null);
  const [createAthlete, setCreateAthlete] = useState(null);
  const [editWorkout, setEditWorkout] = useState(null);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <div style={{ color: '#00E676', fontSize: 48 }}>⚡</div>
    </div>
  );

  if (!user) return authScreen === 'login'
    ? <LoginScreen onGoRegister={() => setAuthScreen('register')} />
    : <RegisterScreen onGoLogin={() => setAuthScreen('login')} />;

  const isCoach = userProfile?.role === 'coach';

  if (isCoach) {
    if (screen === 'create') return <CreateWorkout initDate={createDate} athlete={createAthlete} editWorkout={editWorkout} onBack={() => { setScreen('main'); setEditWorkout(null); }} />;
    if (screen === 'feedback') return <AthleteFeedback workout={selectedWorkout} onBack={() => setScreen('main')} />;
    return (
      <>
        <CoachHome
          onCreateWorkout={(date, athlete, workout) => { setCreateDate(date); setCreateAthlete(athlete); setEditWorkout(workout || null); setScreen('create'); }}
          onViewFeedback={(w) => { setSelectedWorkout(w); setScreen('feedback'); }}
        />
        <div className="bottom-nav">
          <button className="nav-btn active"><span className="nav-icon">🏠</span>Inicio</button>
          <button className="nav-btn" onClick={logout}><span className="nav-icon">🚪</span>Salir</button>
        </div>
      </>
    );
  }

  if (screen === 'detail') return <WorkoutDetail workout={selectedWorkout} onBack={() => setScreen('main')} onLog={() => setScreen('log')} />;
  if (screen === 'log') return <LogWorkout workout={selectedWorkout} onBack={() => setScreen('main')} />;
  return (
    <>
      <AthleteHome
        onViewWorkout={(w) => { setSelectedWorkout(w); setScreen('detail'); }}
        onLogWorkout={(w) => { setSelectedWorkout(w); setScreen('log'); }}
      />
      <div className="bottom-nav">
        <button className="nav-btn active"><span className="nav-icon">🏠</span>Inicio</button>
        <button className="nav-btn" onClick={logout}><span className="nav-icon">🚪</span>Salir</button>
      </div>
    </>
  );
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
