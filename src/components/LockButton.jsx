import { useState } from 'react'

const PASS = '1121'

export default function LockButton({ authed, onLogin, onLogout }) {
  const [open, setOpen] = useState(false)
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [permanent, setPermanent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pass === PASS) {
      onLogin(permanent)
      setOpen(false)
      setPass('')
      setError(false)
      setPermanent(false)
    } else {
      setError(true)
    }
  }

  const handleLockClick = () => {
    if (authed) {
      onLogout()
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleLockClick}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 50,
          width: 52,
          height: 52,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(201,168,76,0.3)',
          cursor: 'pointer',
          fontSize: 24,
          opacity: authed ? 0.9 : 0.55,
        }}
      >
        {authed ? '🔓' : '🔒'}
      </button>

      {open && (
        <div
          onClick={() => { setOpen(false); setPass(''); setError(false) }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 320,
            }}
          >
            <h2 style={{ color: '#c9a84c', textAlign: 'center', margin: '0 0 4px', fontSize: 22 }}>
              Acceso Admin
            </h2>
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '8px 0 20px' }} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="PIN"
                value={pass}
                onChange={e => { setPass(e.target.value); setError(false) }}
                autoFocus
              />
              {error && (
                <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center', margin: 0 }}>
                  Contraseña incorrecta
                </p>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={permanent}
                  onChange={e => setPermanent(e.target.checked)}
                  style={{ width: 'auto', padding: 0, border: 'none', background: 'transparent' }}
                />
                <span style={{ color: 'rgba(245,230,200,0.7)' }}>Recordar en este dispositivo</span>
              </label>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
                  color: '#0d0d0d',
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 0',
                  cursor: 'pointer',
                  marginTop: 4,
                }}
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
