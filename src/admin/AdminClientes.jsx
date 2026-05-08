import { useState } from 'react'
import { db } from '../firebase'
import { ref, update, remove } from 'firebase/database'

export default function AdminClientes({ clientes }) {
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const filtered = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.tel?.includes(search)
  ).sort((a, b) => a.nombre?.localeCompare(b.nombre))

  const handleEdit = (c) => {
    setEditingId(c.id)
    setEditData({ nombre: c.nombre, tel: c.tel, notas: c.notas || '' })
  }

  const handleSave = async () => {
    await update(ref(db, `clientes/${editingId}`), editData)
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return
    await remove(ref(db, `clientes/${id}`))
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Buscar por nombre o celular..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <p style={{ fontSize: 12, color: 'rgba(245,230,200,0.4)', marginBottom: 12 }}>
        {filtered.length} cliente{filtered.length !== 1 ? 's' : ''} registrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 && (
        <p style={{ color: 'rgba(245,230,200,0.35)', textAlign: 'center', marginTop: 24, fontSize: 13 }}>
          Sin clientes registrados
        </p>
      )}

      {filtered.map(c => (
        <div key={c.id} style={{
          background: '#1a1a1a',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 8,
        }}>
          {editingId === c.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input placeholder="Nombre" value={editData.nombre} onChange={e => setEditData(p => ({ ...p, nombre: e.target.value }))} />
              <input placeholder="Celular" value={editData.tel} onChange={e => setEditData(p => ({ ...p, tel: e.target.value }))} />
              <input placeholder="Notas (opcional)" value={editData.notas} onChange={e => setEditData(p => ({ ...p, notas: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={handleSave} style={btnSmallGold}>Guardar</button>
                <button onClick={() => setEditingId(null)} style={btnSmallGray}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 15 }}>{c.nombre}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(245,230,200,0.5)' }}>{c.tel}</p>
                {c.notas && <p style={{ margin: '3px 0 0', fontSize: 11, color: 'rgba(245,230,200,0.35)', fontStyle: 'italic' }}>{c.notas}</p>}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => handleEdit(c)} style={{ ...btnIcon, color: '#c9a84c' }}>✏️</button>
                <button onClick={() => handleDelete(c.id)} style={{ ...btnIcon, color: '#f87171' }}>🗑️</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const btnIcon = { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2 }
const btnSmallGold = { flex: 1, padding: '8px 0', borderRadius: 6, background: 'linear-gradient(135deg,#c9a84c,#e8c97a)', color: '#0d0d0d', fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }
const btnSmallGray = { flex: 1, padding: '8px 0', borderRadius: 6, background: 'rgba(255,255,255,0.08)', color: '#f5e6c8', fontFamily: 'Oswald, sans-serif', fontSize: 13, border: 'none', cursor: 'pointer' }
