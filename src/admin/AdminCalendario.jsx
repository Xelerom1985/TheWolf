import { useState } from 'react'
import { db } from '../firebase'
import { ref, remove, update } from 'firebase/database'

const PELUQUERO_LABEL = { jorge: 'Jorge', daniela: 'Daniela' }
const SERVICIO_LABEL = { corte: 'Corte', barba: 'Barba', corte_barba: 'Corte + Barba' }
const PELUQUEROS = ['jorge', 'daniela']
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAY_NAMES = ['D','L','M','M','J','V','S']

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m)-1, Number(d))
  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  return `${days[date.getDay()]} ${d} ${months[Number(m)-1]}`
}

export default function AdminCalendario({ turnos }) {
  const today = toDateStr(new Date())
  const now = new Date()

  const [currentMonth, setCurrentMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today)
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const prevMonth = () => setCurrentMonth(new Date(year, month-1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month+1, 1))

  const turnosDelDia = turnos
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

  return (
    <div>
      {/* Header mes */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={prevMonth} style={navBtn}>‹</button>
        <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#c9a84c', fontSize: 16 }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={nextMonth} style={navBtn}>›</button>
      </div>

      {/* Cabecera días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAY_NAMES.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, padding: '3px 0', fontFamily: 'Oswald, sans-serif', color: i===0 ? 'rgba(245,230,200,0.25)' : 'rgba(245,230,200,0.45)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grilla días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 16 }}>
        {Array(firstDayOfWeek).fill(null).map((_,i) => <div key={`e${i}`} />)}

        {Array(daysInMonth).fill(null).map((_,i) => {
          const day = i+1
          const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const isSelected = ds === selectedDate
          const isToday = ds === today
          const count = turnos.filter(t => t.fecha === ds).length
          const isSunday = new Date(year, month, day).getDay() === 0

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(ds)}
              style={{
                aspectRatio: '1/1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                padding: 2,
                gap: 2,
                background: isSelected ? '#c9a84c' : isToday ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isSelected ? '#c9a84c' : isToday ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontSize: 12,
                fontFamily: 'Oswald, sans-serif',
                fontWeight: isToday ? 700 : 400,
                color: isSelected ? '#0d0d0d' : isSunday ? 'rgba(245,230,200,0.2)' : '#f5e6c8',
              }}>
                {day}
              </span>
              {count > 0 && (
                <span style={{
                  fontSize: 9,
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 700,
                  color: isSelected ? '#0d0d0d' : '#c9a84c',
                  lineHeight: 1,
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Detalle del día seleccionado */}
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: 14 }}>
        <p style={{ fontFamily: 'Oswald, sans-serif', fontSize: 14, color: '#c9a84c', margin: '0 0 10px' }}>
          {formatDateDisplay(selectedDate)} — {turnosDelDia.length} turno{turnosDelDia.length !== 1 ? 's' : ''}
        </p>

        {turnosDelDia.length === 0 && (
          <p style={{ color: 'rgba(245,230,200,0.35)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
            Sin turnos este día
          </p>
        )}

        {turnosDelDia.map(t => (
          <div key={t.id} style={{
            background: '#1a1a1a',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 8,
          }}>
            {editing === t.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="date" value={editData.fecha} onChange={e => setEditData(p=>({...p, fecha: e.target.value}))} />
                  <input type="time" value={editData.hora} onChange={e => setEditData(p=>({...p, hora: e.target.value}))} />
                </div>
                <select value={editData.peluquero} onChange={e => setEditData(p=>({...p, peluquero: e.target.value}))}>
                  {PELUQUEROS.map(p => <option key={p} value={p}>{PELUQUERO_LABEL[p]}</option>)}
                </select>
                <select value={editData.servicio} onChange={e => setEditData(p=>({...p, servicio: e.target.value}))}>
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
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const navBtn = {
  width: 32, height: 32, borderRadius: '50%',
  background: 'rgba(201,168,76,0.1)', border: 'none',
  color: '#c9a84c', fontSize: 20, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const btnIcon = { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2 }
const btnSmallGold = { flex: 1, padding: '8px 0', borderRadius: 6, background: 'linear-gradient(135deg,#c9a84c,#e8c97a)', color: '#0d0d0d', fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }
const btnSmallGray = { flex: 1, padding: '8px 0', borderRadius: 6, background: 'rgba(255,255,255,0.08)', color: '#f5e6c8', fontFamily: 'Oswald, sans-serif', fontSize: 13, border: 'none', cursor: 'pointer' }
