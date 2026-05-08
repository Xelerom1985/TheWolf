const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 80,
    background: '#0d0d0d',
    backgroundImage: 'radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(139,69,19,0.07) 0%, transparent 50%)',
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #c9a84c',
    boxShadow: '0 0 40px rgba(201,168,76,0.25), 0 0 80px rgba(201,168,76,0.1)',
    marginTop: 48,
  },
  title: {
    fontFamily: 'Playfair Display, serif',
    color: '#c9a84c',
    fontSize: 36,
    letterSpacing: 4,
    margin: '16px 0 0',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Special Elite, cursive',
    color: 'rgba(245,230,200,0.5)',
    fontSize: 13,
    letterSpacing: 6,
    textTransform: 'uppercase',
    margin: '4px 0 0',
  },
  divider: {
    width: 120,
    height: 1,
    background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)',
    margin: '12px 0',
  },
  peluqueros: {
    display: 'flex',
    gap: 8,
    margin: '4px 0 0',
  },
  badge: {
    background: 'rgba(201,168,76,0.12)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: 20,
    padding: '3px 12px',
    fontFamily: 'Oswald, sans-serif',
    fontSize: 12,
    color: '#c9a84c',
    letterSpacing: 1,
  },
}

export default function Home({ novedades, onSacarTurno }) {
  return (
    <div style={S.page}>
      <img src="/logo.jpg" alt="The Wolf" style={S.logo} />
      <h1 style={S.title}>THE WOLF</h1>
      <p style={S.subtitle}>Barbería</p>
      <div style={S.divider} />
      <div style={S.peluqueros}>
        <span style={S.badge}>✂ Jorge</span>
        <span style={S.badge}>✂ Daniela</span>
      </div>

      {/* Novedades */}
      {novedades.length > 0 && (
        <div style={{ width: '100%', maxWidth: 360, padding: '0 16px', marginTop: 24 }}>
          <p style={{
            fontFamily: 'Oswald, sans-serif',
            fontSize: 11,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#c9a84c',
            marginBottom: 8,
          }}>
            📢 Novedades
          </p>
          {novedades.map(n => (
            <div key={n.id} style={{
              background: '#1a1a1a',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 8,
            }}>
              <p style={{ fontFamily: 'Special Elite, cursive', fontSize: 14, margin: 0, lineHeight: 1.4 }}>
                {n.texto}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ width: '100%', maxWidth: 360, padding: '0 16px', marginTop: novedades.length ? 16 : 32 }}>
        <button
          onClick={onSacarTurno}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg,#c9a84c,#e8c97a,#c9a84c)',
            color: '#0d0d0d',
            fontFamily: 'Oswald, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 3,
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: 14,
            padding: '18px 0',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
          }}
        >
          ✂️ SACAR TURNO
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: 11,
          color: 'rgba(245,230,200,0.3)',
          marginTop: 12,
          fontFamily: 'Oswald, sans-serif',
          letterSpacing: 1,
        }}>
          Turnos de 30 a 40 min · Lun a Sáb
        </p>
      </div>
    </div>
  )
}
