import { useState, useEffect, useRef } from 'react'
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
import InstallBanner from './components/InstallBanner'

export default function App() {
  const [page, setPage] = useState('home')
  const [authed, setAuthed] = useState(false)
  const [novedades, setNovedades] = useState([])
  const [turnos, setTurnos] = useState([])
  const [config, setConfig] = useState(null)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const [exitToast, setExitToast] = useState(false)
  const pageRef = useRef(page)
  const lastBackRef = useRef(null)

  useEffect(() => { pageRef.current = page }, [page])

  useEffect(() => {
    history.pushState(null, '')
    const handlePop = () => {
      if (pageRef.current !== 'home') {
        setPage('home')
        history.pushState(null, '')
      } else {
        const now = Date.now()
        if (lastBackRef.current && now - lastBackRef.current < 2000) return
        lastBackRef.current = now
        history.pushState(null, '')
        setExitToast(true)
        setTimeout(() => setExitToast(false), 2000)
      }
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstall(false)
      setInstallPrompt(null)
    }
  }

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

      {showInstall && (
        <InstallBanner
          onInstall={handleInstall}
          onDismiss={() => setShowInstall(false)}
        />
      )}

      {exitToast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(30,30,30,0.95)', border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: 8, padding: '10px 20px', zIndex: 200,
          color: 'rgba(245,230,200,0.85)', fontSize: 13, fontFamily: 'Oswald, sans-serif',
          whiteSpace: 'nowrap',
        }}>
          Presioná de nuevo para salir
        </div>
      )}
    </div>
  )
}
