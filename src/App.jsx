import { useState, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { db } from './firebase'
import { ref, onValue } from 'firebase/database'
import Home from './pages/Home'
import Turnos from './pages/Turnos'
import MisTurnos from './pages/MisTurnos'
import Admin from './pages/Admin'
import LockButton from './components/LockButton'
import Navbar from './components/Navbar'
import UpdateBanner from './components/UpdateBanner'

export default function App() {
  const [page, setPage] = useState('home')
  const [authed, setAuthed] = useState(false)
  const [novedades, setNovedades] = useState([])
  const [turnos, setTurnos] = useState([])
  const [config, setConfig] = useState(null)

  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  useEffect(() => {
    if (localStorage.getItem('wolfPermanentAdmin') === 'true') setAuthed(true)
  }, [])

  useEffect(() => {
    const u1 = onValue(ref(db, 'novedades'), snap => {
      const d = snap.val() || {}
      setNovedades(
        Object.entries(d)
          .map(([id, v]) => ({ id, ...v }))
          .filter(n => n.activo)
          .sort((a, b) => b.createdAt - a.createdAt)
      )
    })
    const u2 = onValue(ref(db, 'turnos'), snap => {
      const d = snap.val() || {}
      setTurnos(Object.entries(d).map(([id, v]) => ({ id, ...v })))
    })
    const u3 = onValue(ref(db, 'config'), snap => {
      setConfig(snap.val() || {})
    })
    return () => { u1(); u2(); u3() }
  }, [])

  const handleLogin = (permanent) => {
    setAuthed(true)
    if (permanent) localStorage.setItem('wolfPermanentAdmin', 'true')
  }

  const handleLogout = () => {
    setAuthed(false)
    localStorage.removeItem('wolfPermanentAdmin')
  }

  const showTurnos = page === 'turnos'

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', color: '#f5e6c8', position: 'relative' }}>
      <LockButton authed={authed} onLogin={handleLogin} onLogout={handleLogout} />

      {page === 'home' && (
        <Home novedades={novedades} onSacarTurno={() => setPage('turnos')} />
      )}
      {page === 'turnos' && (
        <Turnos onBack={() => setPage('home')} turnos={turnos} config={config} />
      )}
      {page === 'misturno' && (
        <MisTurnos turnos={turnos} config={config} />
      )}
      {page === 'admin' && authed && <Admin />}
      {page === 'admin' && !authed && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <p style={{ color: 'rgba(245,230,200,0.4)', fontFamily: 'Oswald, sans-serif' }}>
            Usá el candado para acceder
          </p>
        </div>
      )}

      {!showTurnos && <Navbar page={page} setPage={setPage} authed={authed} />}

      {needRefresh && (
        <UpdateBanner onUpdate={() => updateServiceWorker(true)} />
      )}
    </div>
  )
}
