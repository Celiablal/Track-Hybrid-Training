import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, 'users', u.uid));
        setUserProfile(snap.exists() ? snap.data() : null);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const generateCode = () => {
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('');
  };

  const registerCoach = async (email, password, name) => {
    const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
    const coachCode = generateCode();
    const profile = { uid: u.uid, email, name, role: 'coach', coachCode, athletes: [], createdAt: new Date().toISOString() };
    await setDoc(doc(db, 'users', u.uid), profile);
    await setDoc(doc(db, 'coachCodes', coachCode), { coachId: u.uid, coachName: name });
    setUserProfile(profile);
    return profile;
  };

  const registerAthlete = async (email, password, name, coachCode) => {
    // 1. Crear cuenta primero (esto autentica al usuario)
    const { user: u } = await createUserWithEmailAndPassword(auth, email, password);

    // 2. Ahora ya estamos autenticados, podemos leer Firestore
    const codeSnap = await getDoc(doc(db, 'coachCodes', coachCode.toUpperCase()));
    if (!codeSnap.exists()) {
      // Si el código no existe, borrar la cuenta recién creada y lanzar error
      await u.delete();
      throw new Error('Código de entrenador no válido');
    }
    const { coachId, coachName } = codeSnap.data();

    // 3. Guardar perfil del atleta
    const profile = { uid: u.uid, email, name, role: 'athlete', coachId, coachName, coachCode: coachCode.toUpperCase(), createdAt: new Date().toISOString() };
    await setDoc(doc(db, 'users', u.uid), profile);

    // 4. Añadir atleta a la lista del entrenador
    const coachSnap = await getDoc(doc(db, 'users', coachId));
    const coachData = coachSnap.data();
    await setDoc(doc(db, 'users', coachId), {
      ...coachData,
      athletes: [...(coachData.athletes || []), { uid: u.uid, name, email }]
    });

    setUserProfile(profile);
    return profile;
  };

  const login = async (email, password) => {
    const { user: u } = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'users', u.uid));
    const profile = snap.data();
    setUserProfile(profile);
    return profile;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, registerCoach, registerAthlete, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
