import { useMemo, useState } from 'react'
import { db } from '../firebase'
import { ref, remove, update } from 'firebase/database'

const PELUQUERO_LABEL = { jorge: 'Jorge', daniela: 'Daniela' }
const SERVICIO_LABEL = { corte: 'Corte', barba: 'Barba', corte_barba: 'Corte + Barba' }
const PELUQUEROS = ['jorge', 'daniela']
const SERVICIOS = [
  { id: 'corte', label: 'Corte' },
  { id: 'barba', label: 'Barba' },
  { id: 'corte_barba', label: 'Corte + Barba' },
]

function getTimeSlots() {
  const slots = []
  for (let h = 9; h < 19; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${days[date.getDay()]} ${d} ${months[Number(m) - 1]}`
}

export default function MisTurnos({ turnos }) {
  const user = JSON.parse(localStorage.getItem('wolfUser') || 'null')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const misTurnos = useMemo(() => {
    if (!user) return []
    return turnos
      .filter(t => t.clienteTel === user.tel)
      .sort((a, b) => (a.fecha + a.hora) > (b.fecha + b.hora) ? 1 : -1)
  }, [turnos, user])

  const proximos = misTurnos.filter(t => new Date(t.fecha + 'T23:59:59') >= today)
  const pasados = misTurnos.filter(t => new Date(t.fecha + 'T23:59:59') < today)

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar este turno?')) return
    await remove(ref(db, `turnos/${id}`))
  }

  const openEdit = (t) => {
    setEditingId(t.id)
    setEditData({ fecha: t.fecha, hora: t.hora, peluquero: t.peluquero, servicio: t.servicio })
  }

  const handleSaveEdit = async () => {
    setSaving(true)
    await update(ref(db, `turnos/${editingId}`), editData)
    setEditingId(null)
    setSaving(false)
  }

  // Calcular disponibilidad de slots para fecha dada (excluyendo el turno que se edita)
  const getSlotsForDate = (fecha) => {
    const turnosDia = turnos.filter(t => t.fecha === fecha && t.id !== editingId)
    return getTimeSlots().map(hora => {
      const at = turnosDia.filter(t => t.hora === hora)
      return {
        hora,
        full: at.some(t => t.peluquero === 'jorge') && at.some(t => t.peluquero === 'daniela'),
        jorgeLibre: !at.some(t => t.peluquero === 'jorge'),
        danielaLibre: !at.some(t => t.peluquero === 'daniela'),
      }
    })
  }

  const getPelAvail = (fecha, hora) => {
    const turnosDia = turnos.filter(t => t.fecha === fecha && t.hora === hora && t.id !== editingId)
    return {
      jorgeLibre: !turnosDia.some(t => t.peluquero === 'jorge'),
      danielaLibre: !turnosDia.some(t => t.peluquero === 'daniela'),
    }
  }

  if (!user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <span style={{ fontSize: 48 }}>📅</span>
        <p style={{ color: 'rgba(245,230,200,0.5)', textAlign: 'center', marginTop: 16, fontFamily: 'Oswald, sans-serif' }}>
          Sacá tu primer turno para ver tu historial aquí
        </p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <h2 style={{ color: '#c9a84c', margin: 0, fontSize: 22, fontFamily: 'Playfair Display, serif' }}>
          Mis Turnos
        </h2>
        <p style={{ color: 'rgba(245,230,200,0.5)', margin: '4px 0 0', fontSize: 13 }}>
          {user.nombre} · {user.tel}
        </p>
      </div>

      <div style={{ padding: 16 }}>
        {proximos.length === 0 && pasados.length === 0 && (
          <p style={{ color: 'rgba(245,230,200,0.4)', textAlign: 'center', marginTop: 40 }}>
            No tenés turnos registrados
          </p>
        )}

        {proximos.length > 0 && (
          <>
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 10 }}>
              Próximos
            </p>
            {proximos.map(t => (
              <div key={t.id} style={{
                background: '#1a1a1a',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: 12,
                marginBottom: 10,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 15 }}>
                      {formatDate(t.fecha)} · {t.hora}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(245,230,200,0.5)' }}>
                      {SERVICIO_LABEL[t.servicio]} · {PELUQUERO_LABEL[t.peluquero] || '-'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => openEdit(t)}
                      style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '5px 10px', color: '#c9a84c', fontFamily: 'Oswald, sans-serif', fontSize: 12, cursor: 'pointer' }}
                    >
                      ✏️ Cambiar
                    </button>
                    <button
                      onClick={() => handleCancel(t.id)}
                      style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '5px 10px', color: '#f87171', fontFamily: 'Oswald, sans-serif', fontSize: 12, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {pasados.length > 0 && (
          <>
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(245,230,200,0.4)', margin: '20px 0 10px' }}>
              Historial
            </p>
            {pasados.slice(0, 5).map(t => (
              <div key={t.id} style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 8,
                opacity: 0.6,
              }}>
                <p style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 15, color: 'rgba(245,230,200,0.7)' }}>
                  {formatDate(t.fecha)} · {t.hora}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(245,230,200,0.4)' }}>
                  {SERVICIO_LABEL[t.servicio]} · {PELUQUERO_LABEL[t.peluquero] || '-'}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal de edición */}
      {editingId && (
        <div
          onClick={() => setEditingId(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '16px 16px 0 0',
              padding: 24,
              width: '100%',
              maxWidth: 480,
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif', margin: '0 0 16px', fontSize: 18 }}>
              Cambiar turno
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Fecha */}
              <div>
                <label style={labelStyle}>Fecha</label>
                <input
                  type="date"
                  value={editData.fecha}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setEditData(p => ({ ...p, fecha: e.target.value }))}
                />
              </div>

              {/* Hora */}
              <div>
                <label style={labelStyle}>Horario</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {getSlotsForDate(editData.fecha).map(({ hora, full }) => (
                    <button
                      key={hora}
                      disabled={full}
                      onClick={() => setEditData(p => ({ ...p, hora }))}
                      style={{
                        padding: '8px 0',
                        borderRadius: 8,
                        background: editData.hora === hora ? '#c9a84c' : full ? 'rgba(255,255,255,0.04)' : 'rgba(201,168,76,0.08)',
                        border: `1px solid ${editData.hora === hora ? '#c9a84c' : full ? 'rgba(255,255,255,0.08)' : 'rgba(201,168,76,0.2)'}`,
                        color: editData.hora === hora ? '#0d0d0d' : full ? 'rgba(245,230,200,0.2)' : '#f5e6c8',
                        fontFamily: 'Oswald, sans-serif',
                        fontSize: 12,
                        fontWeight: editData.hora === hora ? 700 : 400,
                        cursor: full ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              {/* Peluquero */}
              <div>
                <label style={labelStyle}>Peluquero</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {PELUQUEROS.map(p => {
                    const avail = getPelAvail(editData.fecha, editData.hora)
                    const libre = p === 'jorge' ? avail.jorgeLibre : avail.danielaLibre
                    const selected = editData.peluquero === p
                    return (
                      <button
                        key={p}
                        disabled={!libre}
                        onClick={() => setEditData(prev => ({ ...prev, peluquero: p }))}
                        style={{
                          flex: 1, padding: '10px 0', borderRadius: 10,
                          background: selected ? '#c9a84c' : 'rgba(201,168,76,0.08)',
                          border: `1px solid ${selected ? '#c9a84c' : libre ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.08)'}`,
                          color: selected ? '#0d0d0d' : libre ? '#f5e6c8' : 'rgba(245,230,200,0.25)',
                          fontFamily: 'Oswald, sans-serif', fontWeight: selected ? 700 : 400,
                          fontSize: 14, cursor: libre ? 'pointer' : 'not-allowed',
                          opacity: !libre && !selected ? 0.4 : 1,
                        }}
                      >
                        {PELUQUERO_LABEL[p]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Servicio */}
              <div>
                <label style={labelStyle}>Servicio</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {SERVICIOS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setEditData(p => ({ ...p, servicio: s.id }))}
                      style={{
                        padding: '10px 14px', borderRadius: 8, textAlign: 'left',
                        background: editData.servicio === s.id ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${editData.servicio === s.id ? '#c9a84c' : 'rgba(255,255,255,0.08)'}`,
                        color: editData.servicio === s.id ? '#c9a84c' : '#f5e6c8',
                        fontFamily: 'Oswald, sans-serif', fontWeight: editData.servicio === s.id ? 600 : 400,
                        fontSize: 14, cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  style={{
                    flex: 2, padding: '13px 0', borderRadius: 10,
                    background: 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
                    color: '#0d0d0d', fontFamily: 'Oswald, sans-serif', fontWeight: 700,
                    fontSize: 14, letterSpacing: 1, border: 'none', cursor: 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Guardando...' : 'GUARDAR CAMBIOS'}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{
                    flex: 1, padding: '13px 0', borderRadius: 10,
                    background: 'rgba(255,255,255,0.07)', color: '#f5e6c8',
                    fontFamily: 'Oswald, sans-serif', fontSize: 14, border: 'none', cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
  color: 'rgba(245,230,200,0.5)', marginBottom: 8, fontFamily: 'Oswald, sans-serif',
}
