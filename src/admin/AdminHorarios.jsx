import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { ref, onValue, set, remove } from 'firebase/database'
import { generateAllTimeOptions } from '../utils/horarios'

const TIME_OPTIONS = generateAllTimeOptions()

function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${days[date.getDay()]} ${d} ${months[Number(m) - 1]}`
}

export default function AdminHorarios() {
  const [config, setConfig] = useState(null)
  const [defInicio, setDefInicio] = useState('09:00')
  const [defFin, setDefFin] = useState('19:00')
  const [savingDef, setSavingDef] = useState(false)
  const [savedDef, setSavedDef] = useState(false)

  const [excFecha, setExcFecha] = useState('')
  const [excTipo, setExcTipo] = useState('especial')
  const [excInicio, setExcInicio] = useState('09:00')
  const [excFin, setExcFin] = useState('13:00')
  const [savingExc, setSavingExc] = useState(false)

  useEffect(() => {
    return onValue(ref(db, 'config'), snap => {
      const d = snap.val()
      setConfig(d)
      if (d?.horarioDefault) {
        setDefInicio(d.horarioDefault.horaInicio || '09:00')
        setDefFin(d.horarioDefault.horaFin || '19:00')
      }
    })
  }, [])

  const handleSaveDef = async () => {
    setSavingDef(true)
    await set(ref(db, 'config/horarioDefault'), { horaInicio: defInicio, horaFin: defFin })
    setSavedDef(true)
    setTimeout(() => setSavedDef(false), 2500)
    setSavingDef(false)
  }

  const handleAddException = async () => {
    if (!excFecha) return
    setSavingExc(true)
    const data = excTipo === 'cerrado'
      ? { cerrado: true }
      : { horaInicio: excInicio, horaFin: excFin, cerrado: false }
    await set(ref(db, `config/horariosPorDia/${excFecha}`), data)
    setExcFecha('')
    setSavingExc(false)
  }

  const handleDelete = async (fecha) => {
    await remove(ref(db, `config/horariosPorDia/${fecha}`))
  }

  const excepciones = Object.entries(config?.horariosPorDia || {})
    .sort(([a], [b]) => a > b ? 1 : -1)

  return (
    <div>

      {/* ── Horario general ── */}
      <div style={card}>
        <p style={secLabel}>🕐 Horario general</p>
        <p style={{ fontSize: 12, color: 'rgba(245,230,200,0.4)', margin: '2px 0 14px', fontFamily: 'Oswald, sans-serif' }}>
          Se aplica a todos los días salvo excepciones
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={fieldLabel}>Apertura</label>
            <select value={defInicio} onChange={e => setDefInicio(e.target.value)}>
              {TIME_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={fieldLabel}>Cierre</label>
            <select value={defFin} onChange={e => setDefFin(e.target.value)}>
              {TIME_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSaveDef} disabled={savingDef} style={{
          ...btnGold,
          background: savedDef ? '#22c55e' : 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
        }}>
          {savedDef ? '✓ GUARDADO' : 'GUARDAR HORARIO GENERAL'}
        </button>
      </div>

      {/* ── Día especial ── */}
      <div style={card}>
        <p style={secLabel}>📅 Excepción por día</p>
        <p style={{ fontSize: 12, color: 'rgba(245,230,200,0.4)', margin: '2px 0 14px', fontFamily: 'Oswald, sans-serif' }}>
          Para un día puntual: medio día o cerrado
        </p>

        <div style={{ marginBottom: 12 }}>
          <label style={fieldLabel}>Fecha</label>
          <input
            type="date"
            value={excFecha}
            onChange={e => setExcFecha(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { id: 'especial', label: '⏱ Horario especial' },
            { id: 'cerrado', label: '🚫 Cerrado' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setExcTipo(opt.id)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8,
                background: excTipo === opt.id ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${excTipo === opt.id ? '#c9a84c' : 'rgba(255,255,255,0.1)'}`,
                color: excTipo === opt.id ? '#c9a84c' : 'rgba(245,230,200,0.5)',
                fontFamily: 'Oswald, sans-serif', fontSize: 13,
                fontWeight: excTipo === opt.id ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {excTipo === 'especial' && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>Desde</label>
              <select value={excInicio} onChange={e => setExcInicio(e.target.value)}>
                {TIME_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>Hasta</label>
              <select value={excFin} onChange={e => setExcFin(e.target.value)}>
                {TIME_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        <button
          onClick={handleAddException}
          disabled={savingExc || !excFecha}
          style={{ ...btnGold, opacity: !excFecha ? 0.45 : 1, cursor: excFecha ? 'pointer' : 'not-allowed' }}
        >
          {savingExc ? 'Guardando...' : '+ GUARDAR DÍA ESPECIAL'}
        </button>
      </div>

      {/* ── Lista excepciones ── */}
      {excepciones.length > 0 && (
        <div>
          <p style={{ ...secLabel, marginBottom: 10 }}>Días configurados</p>
          {excepciones.map(([fecha, data]) => (
            <div key={fecha} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#1a1a1a',
              border: `1px solid ${data.cerrado ? 'rgba(248,113,113,0.3)' : 'rgba(201,168,76,0.2)'}`,
              borderRadius: 10, padding: '12px 14px', marginBottom: 8,
            }}>
              <div>
                <p style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 14 }}>
                  {formatDateDisplay(fecha)}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: data.cerrado ? '#f87171' : '#c9a84c' }}>
                  {data.cerrado ? '🚫 Cerrado' : `⏱ ${data.horaInicio} — ${data.horaFin}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(fecha)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, color: '#f87171', padding: 4 }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {excepciones.length === 0 && config !== null && (
        <p style={{ color: 'rgba(245,230,200,0.3)', fontSize: 13, textAlign: 'center', marginTop: 8, fontFamily: 'Oswald, sans-serif' }}>
          Sin días especiales configurados
        </p>
      )}
    </div>
  )
}

const card = {
  background: '#1a1a1a',
  border: '1px solid rgba(201,168,76,0.2)',
  borderRadius: 12,
  padding: 16,
  marginBottom: 20,
}

const secLabel = {
  fontFamily: 'Oswald, sans-serif', fontSize: 13,
  letterSpacing: 2, textTransform: 'uppercase',
  color: '#c9a84c', margin: '0 0 2px',
}

const fieldLabel = {
  display: 'block', fontSize: 11, letterSpacing: 1,
  textTransform: 'uppercase', color: 'rgba(245,230,200,0.5)',
  marginBottom: 6, fontFamily: 'Oswald, sans-serif',
}

const btnGold = {
  width: '100%', padding: '12px 0', borderRadius: 8,
  background: 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
  color: '#0d0d0d', fontFamily: 'Oswald, sans-serif', fontWeight: 700,
  fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
  border: 'none', cursor: 'pointer', transition: 'background 0.3s',
}
