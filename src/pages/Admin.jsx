import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { ref, onValue } from 'firebase/database'
import AdminCalendario from '../admin/AdminCalendario'
import AdminClientes from '../admin/AdminClientes'
import AdminNuevoTurno from '../admin/AdminNuevoTurno'
import AdminNovedades from '../admin/AdminNovedades'
import AdminHorarios from '../admin/AdminHorarios'

const TABS = [
  { id: 'calendario', label: '📅 Turnos' },
  { id: 'clientes', label: '👤 Clientes' },
  { id: 'nuevo', label: '➕ Nuevo' },
  { id: 'novedades', label: '📢 Novedades' },
  { id: 'horarios', label: '🕐 Horarios' },
]

export default function Admin() {
  const [tab, setTab] = useState('calendario')
  const [turnos, setTurnos] = useState([])
  const [clientes, setClientes] = useState([])
  const [novedades, setNovedades] = useState([])

  useEffect(() => {
    const u1 = onValue(ref(db, 'turnos'), snap => {
      const d = snap.val() || {}
      setTurnos(Object.entries(d).map(([id, v]) => ({ id, ...v })))
    })
    const u2 = onValue(ref(db, 'clientes'), snap => {
      const d = snap.val() || {}
      setClientes(Object.entries(d).map(([id, v]) => ({ id, ...v })))
    })
    const u3 = onValue(ref(db, 'novedades'), snap => {
      const d = snap.val() || {}
      setNovedades(Object.entries(d).map(([id, v]) => ({ id, ...v })))
    })
    return () => { u1(); u2(); u3() }
  }, [])

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(201,168,76,0.15)', textAlign: 'center' }}>
        <h2 style={{ color: '#c9a84c', margin: 0, fontSize: 20, fontFamily: 'Playfair Display, serif' }}>
          Panel Admin
        </h2>
      </div>

      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '0 8px' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0,
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${tab === t.id ? '#c9a84c' : 'transparent'}`,
              color: tab === t.id ? '#c9a84c' : 'rgba(245,230,200,0.45)',
              fontFamily: 'Oswald, sans-serif',
              fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {tab === 'calendario' && <AdminCalendario turnos={turnos} />}
        {tab === 'clientes' && <AdminClientes clientes={clientes} />}
        {tab === 'nuevo' && <AdminNuevoTurno clientes={clientes} turnos={turnos} />}
        {tab === 'novedades' && <AdminNovedades novedades={novedades} />}
        {tab === 'horarios' && <AdminHorarios />}
      </div>
    </div>
  )
}
