import { useState } from 'react'
import { db } from '../firebase'
import { ref, push, set } from 'firebase/database'

const PELUQUEROS = [
  { id: 'jorge', label: 'Jorge' },
  { id: 'daniela', label: 'Daniela' },
]

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

export default function AdminNuevoTurno({ clientes, turnos }) {
  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const [form, setForm] = useState({
    fecha: defaultDate,
    hora: '10:00',
    peluquero: 'jorge',
    servicio: 'corte',
    clienteNombre: '',
    clienteTel: '',
  })
  const [clienteSearch, setClienteSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const turnosDia = turnos.filter(t => t.fecha === form.fecha)
  const slots = getTimeSlots().map(hora => {
    const at = turnosDia.filter(t => t.hora === hora)
    return {
      hora,
      jorgeLibre: !at.some(t => t.peluquero === 'jorge'),
      danielaLibre: !at.some(t => t.peluquero === 'daniela'),
    }
  })

  const slotInfo = slots.find(s => s.hora === form.hora)
  const pelLibre = form.peluquero === 'jorge' ? slotInfo?.jorgeLibre : slotInfo?.danielaLibre

  const filteredClientes = clientes.filter(c =>
    clienteSearch && (
      c.nombre?.toLowerCase().includes(clienteSearch.toLowerCase()) ||
      c.tel?.includes(clienteSearch)
    )
  ).slice(0, 5)

  const selectCliente = (c) => {
    setForm(p => ({ ...p, clienteNombre: c.nombre, clienteTel: c.tel }))
    setClienteSearch('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.clienteNombre || !form.clienteTel) return
    setSaving(true)
    try {
      const newRef = push(ref(db, 'turnos'))
      await set(newRef, { ...form, createdAt: Date.now() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setForm(p => ({ ...p, clienteNombre: '', clienteTel: '' }))
      setClienteSearch('')
    } catch {
      alert('Error al guardar')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Fecha</label>
          <input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Hora</label>
          <select value={form.hora} onChange={e => setForm(p => ({ ...p, hora: e.target.value }))}>
            {slots.map(s => (
              <option key={s.hora} value={s.hora}>{s.hora}</option>
            ))}
          </select>
        </div>
      </div>

      {!pelLibre && (
        <p style={{ fontSize: 12, color: '#fbbf24', margin: 0 }}>
          ⚠️ {form.peluquero === 'jorge' ? 'Jorge' : 'Daniela'} ya tiene turno a esa hora
        </p>
      )}

      <div>
        <label style={labelStyle}>Peluquero</label>
        <select value={form.peluquero} onChange={e => setForm(p => ({ ...p, peluquero: e.target.value }))}>
          {PELUQUEROS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Servicio</label>
        <select value={form.servicio} onChange={e => setForm(p => ({ ...p, servicio: e.target.value }))}>
          {SERVICIOS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Buscar cliente existente</label>
        <input
          placeholder="Nombre o celular..."
          value={clienteSearch}
          onChange={e => setClienteSearch(e.target.value)}
        />
        {filteredClientes.length > 0 && (
          <div style={{ marginTop: 4, background: '#242424', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, overflow: 'hidden' }}>
            {filteredClientes.map(c => (
              <button
                type="button"
                key={c.id}
                onClick={() => selectCliente(c)}
                style={{ display: 'block', width: '100%', padding: '10px 12px', textAlign: 'left', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,168,76,0.1)', color: '#f5e6c8', cursor: 'pointer', fontFamily: 'Oswald, sans-serif', fontSize: 14 }}
              >
                {c.nombre} · {c.tel}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label style={labelStyle}>Nombre del cliente</label>
        <input placeholder="Nombre" value={form.clienteNombre} onChange={e => setForm(p => ({ ...p, clienteNombre: e.target.value }))} required />
      </div>

      <div>
        <label style={labelStyle}>Celular del cliente</label>
        <input placeholder="Celular" type="tel" value={form.clienteTel} onChange={e => setForm(p => ({ ...p, clienteTel: e.target.value }))} required />
      </div>

      <button
        type="submit"
        disabled={saving}
        style={{
          background: saved ? '#22c55e' : 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
          color: '#0d0d0d',
          fontFamily: 'Oswald, sans-serif',
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 2,
          textTransform: 'uppercase',
          border: 'none',
          borderRadius: 10,
          padding: '14px 0',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
          marginTop: 4,
        }}
      >
        {saved ? '✓ TURNO AGREGADO' : saving ? 'Guardando...' : 'AGREGAR TURNO'}
      </button>
    </form>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: 'rgba(245,230,200,0.5)',
  marginBottom: 4,
  fontFamily: 'Oswald, sans-serif',
}
