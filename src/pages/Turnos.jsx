import { useState } from 'react'
import { db } from '../firebase'
import { ref, push, set } from 'firebase/database'
import { getSlotsForDate, isDayClosed, hasSpecialHours } from '../utils/horarios'

const PELUQUEROS = ['jorge', 'daniela']
const PELUQUERO_LABEL = { jorge: 'Jorge', daniela: 'Daniela' }
const SERVICIOS = [
  { id: 'corte', label: 'Corte', dur: '~30 min' },
  { id: 'barba', label: 'Barba', dur: '~20 min' },
  { id: 'corte_barba', label: 'Corte + Barba', dur: '~50 min' },
]

function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${days[date.getDay()]} ${d} ${months[Number(m) - 1]}`
}

export default function Turnos({ onBack, turnos, config }) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedHora, setSelectedHora] = useState(null)
  const [selectedPeluquero, setSelectedPeluquero] = useState(null)
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [regNombre, setRegNombre] = useState('')
  const [regTel, setRegTel] = useState('')

  const user = JSON.parse(localStorage.getItem('wolfUser') || 'null')

  const turnosDelDia = turnos.filter(t => t.fecha === selectedDate)

  const baseSlots = getSlotsForDate(selectedDate || '', config)

  const slotAvailability = baseSlots.map(hora => {
    const at = turnosDelDia.filter(t => t.hora === hora)
    return {
      hora,
      full: at.some(t => t.peluquero === 'jorge') && at.some(t => t.peluquero === 'daniela'),
      jorgeLibre: !at.some(t => t.peluquero === 'jorge'),
      danielaLibre: !at.some(t => t.peluquero === 'daniela'),
    }
  })

  const getAvail = (hora) =>
    slotAvailability.find(s => s.hora === hora) || { jorgeLibre: true, danielaLibre: true }

  const handleConfirm = async () => {
    const currentUser = user || (regNombre && regTel ? { nombre: regNombre, tel: regTel } : null)
    if (!currentUser) return

    if (!user && regNombre && regTel) {
      localStorage.setItem('wolfUser', JSON.stringify({ nombre: regNombre, tel: regTel }))
      const cleanTel = regTel.replace(/\D/g, '') || String(Date.now())
      set(ref(db, `clientes/${cleanTel}`), { nombre: regNombre, tel: regTel, createdAt: Date.now() })
    }

    let peluquero = selectedPeluquero
    if (peluquero === 'any') {
      const avail = getAvail(selectedHora)
      peluquero = avail.jorgeLibre ? 'jorge' : 'daniela'
    }

    setSaving(true)
    try {
      const newRef = push(ref(db, 'turnos'))
      await set(newRef, {
        fecha: selectedDate,
        hora: selectedHora,
        peluquero,
        servicio: selectedServicio,
        clienteNombre: currentUser.nombre,
        clienteTel: currentUser.tel,
        createdAt: Date.now(),
      })
      setDone(true)
    } catch {
      alert('Error al guardar. Intenta de nuevo.')
    }
    setSaving(false)
  }

  if (done) {
    const finalPeluquero = selectedPeluquero === 'any'
      ? (getAvail(selectedHora).jorgeLibre ? 'jorge' : 'daniela')
      : selectedPeluquero

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <span style={{ fontSize: 64 }}>✅</span>
        <h2 style={{ color: '#c9a84c', textAlign: 'center', marginTop: 12 }}>¡Turno confirmado!</h2>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12, padding: 20, width: '100%', maxWidth: 300, marginTop: 8 }}>
          {[
            ['Día', formatDateDisplay(selectedDate)],
            ['Hora', selectedHora],
            ['Peluquero', PELUQUERO_LABEL[finalPeluquero]],
            ['Servicio', SERVICIOS.find(s => s.id === selectedServicio)?.label],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
              <span style={{ fontSize: 12, color: 'rgba(245,230,200,0.5)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{ ...btnGold, marginTop: 24, padding: '12px 40px', borderRadius: 10 }}>
          Volver al inicio
        </button>
      </div>
    )
  }

  const stepTitles = ['', 'Elegir día', 'Elegir horario', 'Elegir peluquero', 'Elegir servicio', 'Confirmar turno']

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <button
          onClick={step > 1 ? () => setStep(s => s - 1) : onBack}
          style={{ background: 'none', border: 'none', color: 'rgba(245,230,200,0.6)', fontSize: 22, cursor: 'pointer', padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        <h2 style={{ color: '#c9a84c', margin: 0, fontSize: 18, fontFamily: 'Playfair Display, serif' }}>
          {stepTitles[step]}
        </h2>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: '10px 16px 0' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 99, background: s <= step ? '#c9a84c' : 'rgba(201,168,76,0.2)' }} />
        ))}
      </div>

      <div style={{ padding: '16px 16px 0' }}>

        {step === 1 && (
          <CalendarPicker config={config} onSelect={date => { setSelectedDate(date); setStep(2) }} />
        )}

        {step === 2 && (
          <div>
            <p style={{ fontSize: 12, color: 'rgba(245,230,200,0.5)', marginTop: 0, marginBottom: 12 }}>
              {formatDateDisplay(selectedDate)}
            </p>
            {slotAvailability.length === 0 ? (
              <p style={{ color: 'rgba(245,230,200,0.4)', textAlign: 'center', marginTop: 32 }}>
                No hay horarios disponibles este día
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {slotAvailability.map(({ hora, full }) => (
                  <button
                    key={hora}
                    disabled={full}
                    onClick={() => { setSelectedHora(hora); setStep(3) }}
                    style={{
                      padding: '12px 0', borderRadius: 10,
                      background: full ? 'rgba(255,255,255,0.04)' : 'rgba(201,168,76,0.1)',
                      border: `1px solid ${full ? 'rgba(255,255,255,0.08)' : 'rgba(201,168,76,0.3)'}`,
                      color: full ? 'rgba(245,230,200,0.25)' : '#f5e6c8',
                      fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 14,
                      cursor: full ? 'not-allowed' : 'pointer', lineHeight: 1.2,
                    }}
                  >
                    {hora}
                    {full && <span style={{ display: 'block', fontSize: 10, fontWeight: 400, opacity: 0.6 }}>Completo</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ fontSize: 12, color: 'rgba(245,230,200,0.5)', marginTop: 0, marginBottom: 12 }}>
              {formatDateDisplay(selectedDate)} a las {selectedHora}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <BarberCard label="Sin preferencia" sub="Asignar el disponible" available onClick={() => { setSelectedPeluquero('any'); setStep(4) }} />
              {PELUQUEROS.map(p => {
                const avail = getAvail(selectedHora)
                const libre = p === 'jorge' ? avail.jorgeLibre : avail.danielaLibre
                return (
                  <BarberCard
                    key={p}
                    label={PELUQUERO_LABEL[p]}
                    available={libre}
                    onClick={() => { if (libre) { setSelectedPeluquero(p); setStep(4) } }}
                  />
                )
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SERVICIOS.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedServicio(s.id); setStep(5) }}
                style={{
                  background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 12, padding: '16px', textAlign: 'left', cursor: 'pointer',
                }}
              >
                <p style={{ margin: 0, color: '#c9a84c', fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 17 }}>{s.label}</p>
                <p style={{ margin: '4px 0 0', color: 'rgba(245,230,200,0.5)', fontSize: 12 }}>{s.dur}</p>
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <div>
            <div style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <p style={{ color: '#c9a84c', fontFamily: 'Playfair Display, serif', margin: '0 0 12px', fontSize: 16 }}>Resumen</p>
              {[
                ['Día', formatDateDisplay(selectedDate)],
                ['Hora', selectedHora],
                ['Peluquero', selectedPeluquero === 'any' ? 'Sin preferencia' : PELUQUERO_LABEL[selectedPeluquero]],
                ['Servicio', SERVICIOS.find(s => s.id === selectedServicio)?.label],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(245,230,200,0.5)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>

            {user ? (
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: 'rgba(245,230,200,0.4)', margin: '0 0 4px', letterSpacing: 1 }}>TURNO A NOMBRE DE</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{user.nombre}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(245,230,200,0.5)' }}>{user.tel}</p>
              </div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'rgba(245,230,200,0.6)', marginBottom: 10 }}>
                  Es tu primera vez. Completá tus datos:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input placeholder="Tu nombre" value={regNombre} onChange={e => setRegNombre(e.target.value)} />
                  <input placeholder="Tu celular" type="tel" value={regTel} onChange={e => setRegTel(e.target.value)} />
                </div>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={saving || (!user && (!regNombre || !regTel))}
              style={{ ...btnGold, width: '100%', padding: '16px 0', borderRadius: 12, opacity: (saving || (!user && (!regNombre || !regTel))) ? 0.6 : 1 }}
            >
              {saving ? 'Guardando...' : '✓ CONFIRMAR TURNO'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function BarberCard({ label, sub, available, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      style={{
        background: '#1a1a1a',
        border: `1px solid ${available ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12, padding: '14px 16px', textAlign: 'left',
        cursor: available ? 'pointer' : 'not-allowed',
        opacity: available ? 1 : 0.4,
      }}
    >
      <p style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 17, color: available ? '#f5e6c8' : 'rgba(245,230,200,0.5)' }}>
        {label}
      </p>
      {sub && <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(245,230,200,0.5)' }}>{sub}</p>}
      {!sub && (
        <p style={{ margin: '3px 0 0', fontSize: 12, color: available ? '#c9a84c' : '#f87171' }}>
          {available ? '✓ Disponible' : '✗ Ocupado'}
        </p>
      )}
    </button>
  )
}

function CalendarPicker({ config, onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const canGoPrev = currentMonth > minMonth

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} disabled={!canGoPrev}
          style={{ ...navBtn, opacity: canGoPrev ? 1 : 0.25 }}>‹</button>
        <span style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, color: '#c9a84c', fontSize: 16 }}>
          {monthNames[month]} {year}
        </span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} style={navBtn}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {dayNames.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, padding: '4px 0', color: i === 0 ? 'rgba(245,230,200,0.25)' : 'rgba(245,230,200,0.45)', fontFamily: 'Oswald, sans-serif' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {Array(firstDayOfWeek).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isPast = date < today
          const isSunday = date.getDay() === 0
          const closed = isDayClosed(dateStr, config)
          const special = hasSpecialHours(dateStr, config)
          const isToday = date.getTime() === today.getTime()
          const disabled = isPast || isSunday || closed

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              style={{
                aspectRatio: '1/1',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, fontSize: 13,
                fontFamily: 'Oswald, sans-serif',
                fontWeight: isToday ? 700 : 400,
                background: isToday ? 'rgba(201,168,76,0.2)' : closed ? 'rgba(248,113,113,0.08)' : 'transparent',
                border: `1px solid ${isToday ? 'rgba(201,168,76,0.5)' : closed ? 'rgba(248,113,113,0.2)' : 'transparent'}`,
                color: disabled ? 'rgba(245,230,200,0.18)' : '#f5e6c8',
                cursor: disabled ? 'not-allowed' : 'pointer',
                gap: 2,
              }}
            >
              {day}
              {special && !disabled && (
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fbbf24' }} />
              )}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(245,230,200,0.35)', fontFamily: 'Oswald, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'rgba(248,113,113,0.4)' }} /> Cerrado
        </span>
        <span style={{ fontSize: 10, color: 'rgba(245,230,200,0.35)', fontFamily: 'Oswald, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#fbbf24' }} /> Horario especial
        </span>
      </div>
    </div>
  )
}

const navBtn = {
  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: 'none',
  color: '#c9a84c', fontSize: 20, cursor: 'pointer',
}

const btnGold = {
  background: 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
  color: '#0d0d0d', fontFamily: 'Oswald, sans-serif', fontWeight: 700,
  fontSize: 15, letterSpacing: 2, textTransform: 'uppercase',
  border: 'none', cursor: 'pointer',
}
