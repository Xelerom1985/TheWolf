import { useMemo } from 'react'

const PELUQUERO_LABEL = { jorge: 'Jorge', daniela: 'Daniela' }
const SERVICIO_LABEL = { corte: 'Corte', barba: 'Barba', corte_barba: 'Corte + Barba' }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(y, m - 1, d)
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${days[date.getDay()]} ${d} ${months[m - 1]}`
}

export default function MisTurnos({ turnos }) {
  const user = JSON.parse(localStorage.getItem('wolfUser') || 'null')

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

      <div style={{ padding: '16px' }}>
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
            {proximos.map(t => <TurnoCard key={t.id} turno={t} upcoming />)}
          </>
        )}

        {pasados.length > 0 && (
          <>
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(245,230,200,0.4)', margin: '20px 0 10px' }}>
              Historial
            </p>
            {pasados.slice(0, 5).map(t => <TurnoCard key={t.id} turno={t} />)}
          </>
        )}
      </div>
    </div>
  )
}

function TurnoCard({ turno, upcoming }) {
  return (
    <div style={{
      background: '#1a1a1a',
      border: `1px solid ${upcoming ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 10,
      padding: '12px 14px',
      marginBottom: 10,
      opacity: upcoming ? 1 : 0.6,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <p style={{ margin: 0, fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 15, color: upcoming ? '#f5e6c8' : 'rgba(245,230,200,0.7)' }}>
          {formatDate(turno.fecha)} · {turno.hora}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(245,230,200,0.5)' }}>
          {SERVICIO_LABEL[turno.servicio]} · {PELUQUERO_LABEL[turno.peluquero] || 'Sin asignar'}
        </p>
      </div>
      {upcoming && (
        <span style={{
          background: 'rgba(201,168,76,0.15)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: 20,
          padding: '3px 10px',
          fontSize: 10,
          fontFamily: 'Oswald, sans-serif',
          color: '#c9a84c',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
          Próximo
        </span>
      )}
    </div>
  )
}
