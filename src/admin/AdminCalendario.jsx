import { useState } from 'react'
import { db } from '../firebase'
import { ref, remove, update } from 'firebase/database'

const PELUQUERO_LABEL = { jorge: 'Jorge', daniela: 'Daniela' }
const SERVICIO_LABEL = { corte: 'Corte', barba: 'Barba', corte_barba: 'Corte + Barba' }
const PELUQUEROS = ['jorge', 'daniela']

function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${days[date.getDay()]} ${d} ${months[Number(m) - 1]}`
}

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function AdminCalendario({ turnos }) {
  const today = toDateStr(new Date())
  const [selectedDate, setSelectedDate] = useState(today)
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})

  const turnosDia = turnos
    .filter(t => t.fecha === selectedDate)
    .sort((a, b) => a.hora > b.hora ? 1 : -1)

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este turno?')) return
    await remove(ref(db, `turnos/${id}`))
  }

  const handleEdit = (t) => {
    setEditing(t.id)
    setEditData({ fecha: t.fecha, hora: t.hora, peluquero: t.peluquero, servicio: t.servicio })
  }

  const handleSaveEdit = async () => {
    await update(ref(db, `turnos/${editing}`), editData)
    setEditing(null)
  }

  // Build week navigation
  const sel = new Date(selectedDate + 'T12:00:00')
  const weekStart = new Date(sel)
  weekStart.setDate(sel.getDate() - sel.getDay())

  const weekDays = Array(7).fill(null).map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

  const prevWeek = () => {
    const d = new Date(sel)
    d.setDate(d.getDate() - 7)
    setSelectedDate(toDateStr(d))
  }
  const nextWeek = () => {
    const d = new Date(sel)
    d.setDate(d.getDate() + 7)
    setSelectedDate(toDateStr(d))
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div>
      {/* Week header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button onClick={prevWeek} style={navBtn}>‹</button>
          <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, color: 'rgba(245,230,200,0.6)' }}>
            {monthNames[sel.getMonth()]} {sel.getFullYear()}
          </span>
          <button onClick={nextWeek} style={navBtn}>›</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {weekDays.map((d, i) => {
            const ds = toDateStr(d)
            const isSelected = ds === selectedDate
            const hasT = turnos.some(t => t.fecha === ds)
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(ds)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '6px 2px',
                  borderRadius: 8,
                  background: isSelected ? '#c9a84c' : 'transparent',
                  border: `1px solid ${isSelected ? '#c9a84c' : 'transparent'}`,
                  cursor: 'pointer',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 10, fontFamily: 'Oswald, sans-serif', color: isSelected ? '#0d0d0d' : 'rgba(245,230,200,0.4)' }}>
                  {dayNames[i]}
                </span>
                <span style={{ fontSize: 14, fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: isSelected ? '#0d0d0d' : '#f5e6c8' }}>
                  {d.getDate()}
                </span>
                {hasT && !isSelected && (
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <p style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, color: '#c9a84c', marginBottom: 10 }}>
        {formatDateDisplay(selectedDate)} — {turnosDia.length} turno{turnosDia.length !== 1 ? 's' : ''}
      </p>

      {turnosDia.length === 0 && (
        <p style={{ color: 'rgba(245,230,200,0.4)', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
          Sin turnos este día
        </p>
      )}

      {turnosDia.map(t => (
        <div key={t.id} style={{
          background: '#1a1a1a',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 8,
        }}>
          {editing === t.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="date" value={editData.fecha} onChange={e => setEditData(p => ({ ...p, fecha: e.target.value }))} />
                <input type="time" value={editData.hora} onChange={e => setEditData(p => ({ ...p, hora: e.target.value }))} />
              </div>
              <select value={editData.peluquero} onChange={e => setEditData(p => ({ ...p, peluquero: e.target.value }))}>
                {PELUQUEROS.map(p => <option key={p} value={p}>{PELUQUERO_LABEL[p]}</option>)}
              </select>
              <select value={editData.servicio} onChange={e => setEditData(p => ({ ...p, servicio: e.target.value }))}>
                <option value="corte">Corte</option>
                <option value="barba">Barba</option>
                <option value="corte_barba">Corte + Barba</option>
              </select>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={handleSaveEdit} style={btnSmallGold}>Guardar</button>
                <button onClick={() => setEditing(null)} style={btnSmallGray}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 15 }}>
                    {t.hora} — {t.clienteNombre}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(245,230,200,0.5)' }}>
                    {SERVICIO_LABEL[t.servicio]} · {PELUQUERO_LABEL[t.peluquero]} · {t.clienteTel}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => handleEdit(t)} style={{ ...btnIcon, color: '#c9a84c' }}>✏️</button>
                  <button onClick={() => handleDelete(t.id)} style={{ ...btnIcon, color: '#f87171' }}>🗑️</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const navBtn = {
  width: 30, height: 30, borderRadius: '50%',
  background: 'rgba(201,168,76,0.1)', border: 'none',
  color: '#c9a84c', fontSize: 18, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const btnIcon = {
  background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2,
}

const btnSmallGold = {
  flex: 1, padding: '8px 0', borderRadius: 6,
  background: 'linear-gradient(135deg,#c9a84c,#e8c97a)',
  color: '#0d0d0d', fontFamily: 'Oswald, sans-serif', fontWeight: 600,
  fontSize: 13, border: 'none', cursor: 'pointer',
}

const btnSmallGray = {
  flex: 1, padding: '8px 0', borderRadius: 6,
  background: 'rgba(255,255,255,0.08)', color: '#f5e6c8',
  fontFamily: 'Oswald, sans-serif', fontSize: 13, border: 'none', cursor: 'pointer',
}
