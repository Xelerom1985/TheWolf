export default function Home({ novedades, onSacarTurno }) {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative', background: '#0d0d0d' }}>

      {/* Fondo pelu esfumado */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '65vh',
        backgroundImage: 'url(/pelu.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        zIndex: 0,
      }}>
        {/* Overlay oscuro: semi-transparente arriba, negro total abajo */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.75) 50%, rgba(13,13,13,1) 100%)',
        }} />
      </div>

      {/* Contenido encima del fondo */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <img
          src="/logo.jpg"
          alt="The Wolf"
          style={{
            width: 160, height: 160,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #c9a84c',
            boxShadow: '0 0 40px rgba(201,168,76,0.3), 0 0 80px rgba(201,168,76,0.12)',
            marginTop: 52,
          }}
        />

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          color: '#c9a84c',
          fontSize: 36,
          letterSpacing: 4,
          margin: '16px 0 0',
          textAlign: 'center',
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}>
          THE WOLF
        </h1>

        <p style={{
          fontFamily: 'Special Elite, cursive',
          color: 'rgba(245,230,200,0.55)',
          fontSize: 13,
          letterSpacing: 6,
          textTransform: 'uppercase',
          margin: '4px 0 0',
        }}>
          Barbería
        </p>

        <div style={{ width: 120, height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '12px 0' }} />

        <div style={{ display: 'flex', gap: 8 }}>
          {['✂ Jorge', '✂ Daniela'].map(label => (
            <span key={label} style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 20,
              padding: '3px 12px',
              fontFamily: 'Oswald, sans-serif',
              fontSize: 12,
              color: '#c9a84c',
              letterSpacing: 1,
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* Novedades */}
        {novedades.length > 0 && (
          <div style={{ width: '100%', maxWidth: 360, padding: '0 16px', marginTop: 28 }}>
            <p style={{ fontFamily: 'Oswald, sans-serif', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 8 }}>
              📢 Novedades
            </p>
            {novedades.map(n => (
              <div key={n.id} style={{
                background: 'rgba(26,26,26,0.92)',
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
        <div style={{ width: '100%', maxWidth: 360, padding: '0 16px', marginTop: novedades.length ? 16 : 36 }}>
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
              boxShadow: '0 4px 24px rgba(201,168,76,0.35)',
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
    </div>
  )
}
