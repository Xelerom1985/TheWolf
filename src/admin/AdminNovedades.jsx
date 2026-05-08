import { useState } from 'react'
import { db } from '../firebase'
import { ref, push, set, update, remove } from 'firebase/database'

export default function AdminNovedades({ novedades }) {
  const [texto, setTexto] = useState('')
  const [saving, setSaving] = useState(false)

  const sorted = [...novedades].sort((a, b) => b.createdAt - a.createdAt)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    setSaving(true)
    const newRef = push(ref(db, 'novedades'))
    await set(newRef, { texto: texto.trim(), activo: true, createdAt: Date.now() })
    setTexto('')
    setSaving(false)
  }

  const toggleActivo = async (id, current) => {
    await update(ref(db, `novedades/${id}`), { activo: !current })
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta novedad?')) return
    await remove(ref(db, `novedades/${id}`))
  }

  return (
    <div>
      {/* Agregar novedad */}
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Nueva novedad</label>
        <textarea
          placeholder="Ej: Mañana NO abrimos · Turnos disponibles desde las 10hs"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          rows={3}
          style={{ resize: 'vertical', lineHeight: 1.4 }}
        />
        <button
          type="submit"
          disabled={saving || !texto.trim()}
          style={{
            background: 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
            color: '#0d0d0d',
            fontFamily: 'Oswald, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            width: '100%',
            cursor: saving || !texto.trim() ? 'not-allowed' : 'pointer',
            opacity: saving || !texto.trim() ? 0.5 : 1,
            marginTop: 8,
          }}
        >
          + PUBLICAR
        </button>
      </form>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)', marginBottom: 16 }} />

      {sorted.length === 0 && (
        <p style={{ color: 'rgba(245,230,200,0.35)', textAlign: 'center', fontSize: 13 }}>
          Sin novedades publicadas
        </p>
      )}

      {sorted.map(n => (
        <div key={n.id} style={{
          background: '#1a1a1a',
          border: `1px solid ${n.activo ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 8,
          opacity: n.activo ? 1 : 0.5,
        }}>
          <p style={{ margin: '0 0 8px', fontFamily: 'Special Elite, cursive', fontSize: 13, lineHeight: 1.4 }}>
            {n.texto}
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => toggleActivo(n.id, n.activo)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: n.activo ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                background: n.activo ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: n.activo ? '#c9a84c' : 'rgba(245,230,200,0.4)',
                fontFamily: 'Oswald, sans-serif',
                fontSize: 11,
                letterSpacing: 1,
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {n.activo ? '● Visible' : '○ Oculta'}
            </button>
            <button
              onClick={() => handleDelete(n.id)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 15, color: '#f87171' }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: 'rgba(245,230,200,0.5)',
  marginBottom: 6,
  fontFamily: 'Oswald, sans-serif',
}
